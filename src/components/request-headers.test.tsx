import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RequestHeaders } from './request-headers';

const useSearchParamsMock = jest.fn();
const useRequestStoreMock = jest.fn();

jest.mock('next/navigation', () => ({
  get useSearchParams() {
    return useSearchParamsMock;
  },
}));

jest.mock('@/store/request-store', () => ({
  get useRequestStore() {
    return useRequestStoreMock;
  },
}));

const makeSearchParams = (entries: Array<[string, string]>) => {
  const params = new URLSearchParams(entries);
  return {
    toString: () => params.toString(),
    forEach: (cb: (value: string, key: string) => void) => {
      entries.forEach(([key, value]) => cb(value, key));
    },
  };
};

const addHeader = jest.fn();
const removeHeader = jest.fn();
const updateHeaderKey = jest.fn();
const updateHeaderValue = jest.fn();
const clearHeaders = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();

  useSearchParamsMock.mockReturnValue(makeSearchParams([]));
  useRequestStoreMock.mockReturnValue({
    headers: [
      { id: '1', key: 'Accept', value: 'application/json' },
      { id: '2', key: 'X-Req-Id', value: 'abc-123' },
    ],
    addHeader,
    removeHeader,
    updateHeaderKey,
    updateHeaderValue,
    clearHeaders,
  });
});

const isInput = (el: Element): el is HTMLInputElement =>
  el instanceof HTMLInputElement;

describe('RequestHeaders', () => {
  test('renders title and current headers from store', () => {
    render(<RequestHeaders />);
    expect(screen.getByText('RequestHeaders.headers')).toBeInTheDocument();

    const keyInputs = screen
      .getAllByRole('textbox', {
        name: 'Key',
      })
      .filter(isInput);
    const valInputs = screen
      .getAllByRole('textbox', {
        name: 'Value',
      })
      .filter(isInput);

    expect(keyInputs.map(i => i.value)).toEqual(['Accept', 'X-Req-Id']);
    expect(valInputs.map(i => i.value)).toEqual([
      'application/json',
      'abc-123',
    ]);
  });

  test('click to plus calls addHeader', () => {
    render(<RequestHeaders />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(addHeader).toHaveBeenCalledTimes(1);
  });

  test('click to cart deletes specific line', () => {
    render(<RequestHeaders />);

    const deleteIcons = screen.getAllByTestId('DeleteIcon');
    const deleteBtn = deleteIcons[1].closest('button');
    if (!(deleteBtn instanceof HTMLButtonElement)) {
      throw new Error('Expected delete button');
    }

    fireEvent.click(deleteBtn);
    expect(removeHeader).toHaveBeenCalledWith('2');
  });

  test('changing Key calls updateHeaderKey with id and new value', () => {
    render(<RequestHeaders />);

    const keyInputs = screen
      .getAllByRole('textbox', {
        name: 'Key',
      })
      .filter(isInput);
    fireEvent.change(keyInputs[0], { target: { value: 'Content-Type' } });

    expect(updateHeaderKey).toHaveBeenCalledWith({
      id: '1',
      key: 'Content-Type',
    });
  });

  test('changing Value calls updateHeaderValue with id and new value', () => {
    render(<RequestHeaders />);

    const valInputs = screen
      .getAllByRole('textbox', {
        name: 'Value',
      })
      .filter(isInput);
    fireEvent.change(valInputs[1], { target: { value: 'xyz' } });

    expect(updateHeaderValue).toHaveBeenCalledWith({ id: '2', value: 'xyz' });
  });

  test('if query-params are present: clearHeaders and addHeader for each', () => {
    useSearchParamsMock.mockReturnValue(
      makeSearchParams([
        ['Auth', 'token-123'],
        ['X-Custom', 'val'],
      ])
    );

    render(<RequestHeaders />);

    expect(clearHeaders).toHaveBeenCalledTimes(1);
    expect(addHeader).toHaveBeenCalledTimes(2);
    expect(addHeader).toHaveBeenNthCalledWith(1, {
      key: 'Auth',
      value: 'token-123',
    });
    expect(addHeader).toHaveBeenNthCalledWith(2, {
      key: 'X-Custom',
      value: 'val',
    });
  });

  test("if there aren't query-params: clearHeaders and addHeader aren't called", () => {
    useSearchParamsMock.mockReturnValue(makeSearchParams([]));
    render(<RequestHeaders />);

    expect(clearHeaders).not.toHaveBeenCalled();
    expect(addHeader).not.toHaveBeenCalled();
  });
});
