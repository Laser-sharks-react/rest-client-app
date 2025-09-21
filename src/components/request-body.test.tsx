import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RequestBody } from './request-body';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/store/request-store', () => ({
  useRequestStore: jest.fn(),
}));

jest.mock('@/lib/utils/base64', () => ({
  base64Decode: jest.fn(),
}));

jest.mock('@/components/json-editor', () => {
  return function JsonEditorMock({
    initial,
    onValidChange,
  }: {
    initial: string;
    onValidChange: (value: string) => void;
  }) {
    return (
      <div data-testid="json-editor" data-initial={initial}>
        <button onClick={() => onValidChange('new-body')}>change</button>
      </div>
    );
  };
});

const useParamsMock = jest.requireMock('next/navigation').useParams;
const useRequestStoreMock = jest.requireMock(
  '@/store/request-store'
).useRequestStore;
const base64DecodeMock = jest.requireMock('@/lib/utils/base64').base64Decode;

beforeEach(() => {
  jest.clearAllMocks();

  useRequestStoreMock.mockReturnValue({
    body: 'current-body',
    method: 'POST',
    setBody: jest.fn(),
  });

  useParamsMock.mockReturnValue({
    params: ['POST', 'http%3A%2F%2Fexample', undefined],
  });
});

describe('RequestBody', () => {
  test('returns null for method GET', () => {
    useRequestStoreMock.mockReturnValue({
      body: '',
      method: 'GET',
      setBody: jest.fn(),
    });

    const { container } = render(<RequestBody />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('RequestBody.body')).not.toBeInTheDocument();
  });

  test('renders Card, header and JsonEditor when not GET', () => {
    render(<RequestBody />);

    expect(screen.getByText('RequestBody.body')).toBeInTheDocument();

    const editor = screen.getByTestId('json-editor');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute('data-initial', 'current-body');

    const { setBody } = useRequestStoreMock.mock.results[0].value;
    expect(setBody).not.toHaveBeenCalled();
  });

  test('if bodyParam exists — decodes and calls setBody', () => {
    useParamsMock.mockReturnValue({
      params: ['POST', 'http%3A%2F%2Fexample', 'YWJjJTNEJTJGayUyRg'],
    });
    base64DecodeMock.mockReturnValue('decoded-body');

    render(<RequestBody />);

    const { setBody } = useRequestStoreMock.mock.results[0].value;
    expect(base64DecodeMock).toHaveBeenCalledWith(
      decodeURIComponent('YWJjJTNEJTJGayUyRg')
    );
    expect(setBody).toHaveBeenCalledWith('decoded-body');
  });

  test('throw onValidChange in setBody (edit in JsonEditor)', () => {
    render(<RequestBody />);

    const { setBody } = useRequestStoreMock.mock.results[0].value;
    fireEvent.click(screen.getByText('change'));

    expect(setBody).toHaveBeenCalledWith('new-body');
  });
});
