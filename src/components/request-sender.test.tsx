import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RequestSender } from './request-sender';
import { DEFAULT_HTTP_METHOD, HTTP_METHODS } from '@/lib/constants/request';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    children?: React.ReactNode;
    value?: unknown;
    name?: string;
  };

  const Select: React.FC<SelectProps> = ({ children, ...props }) => (
    <select data-testid="method-select" {...props}>
      {children}
    </select>
  );

  type MenuItemProps = React.OptionHTMLAttributes<HTMLOptionElement> & {
    value?: unknown;
    children?: React.ReactNode;
  };

  const MenuItem: React.FC<MenuItemProps> = ({ value, children, ...rest }) => (
    <option value={value} {...rest}>
      {children}
    </option>
  );
  return { ...actual, Select, MenuItem };
});

const useParamsMock = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => useParamsMock(),
}));

const setMethod = jest.fn();
const setUrl = jest.fn();
jest.mock('@/store/request-store', () => ({
  useRequestStore: () => ({
    method: 'GET',
    url: '',
    setMethod,
    setUrl,
  }),
}));

const base64DecodeMock = jest.fn((string: string) => `decoded(${string})`);
jest.mock('@/lib/utils/base64', () => ({
  base64Decode: (string: string) => base64DecodeMock(string),
}));

beforeEach(() => {
  jest.clearAllMocks();
  useParamsMock.mockReturnValue({ params: undefined });
});

describe('RequestSender', () => {
  test('renders methods, initial url, and submit disabled when url empty', () => {
    render(<RequestSender />);

    const select = screen.getByTestId('method-select');
    expect(select).toBeInTheDocument();
    const options = Array.from(select.querySelectorAll('option')).map(
      option => option.textContent
    );
    expect(options).toEqual(HTTP_METHODS);

    const urlInput = screen.getByRole('textbox', {
      name: 'Endpoint URL',
    });
    expect(urlInput).toHaveValue('');

    const submitBtn = screen.getByRole('button', {
      name: 'RequestSender.button',
    });
    expect(submitBtn).toBeDisabled();
  });

  test('changing method via select calls setMethod', () => {
    render(<RequestSender />);

    const select = screen.getByTestId('method-select');
    fireEvent.change(select, { target: { value: 'POST' } });

    expect(setMethod).toHaveBeenLastCalledWith('POST');
  });

  test('useEffect: when params contain valid method and url -> setMethod(methodParam) and setUrl(decoded)', () => {
    const rawUrl = encodeURIComponent('aHR0cHM6Ly9leGFtcGxlLmNvbQ==');
    useParamsMock.mockReturnValue({ params: ['POST', rawUrl] });

    render(<RequestSender />);

    expect(setMethod).toHaveBeenCalledWith('POST');
    expect(base64DecodeMock).toHaveBeenCalledWith(
      'aHR0cHM6Ly9leGFtcGxlLmNvbQ=='
    );
    expect(setUrl).toHaveBeenCalledWith(
      'decoded(aHR0cHM6Ly9leGFtcGxlLmNvbQ==)'
    );
  });

  test('useEffect: when methodParam is invalid setMethod(DEFAULT_HTTP_METHOD) is called', () => {
    useParamsMock.mockReturnValue({ params: ['INVALID', undefined] });
    render(<RequestSender />);
    expect(setMethod).toHaveBeenCalledWith(DEFAULT_HTTP_METHOD);
  });

  test("useEffect: when no params setMethod/setUrl aren't called", () => {
    useParamsMock.mockReturnValue({ params: undefined });

    render(<RequestSender />);

    expect(setMethod).not.toHaveBeenCalled();
    expect(setUrl).not.toHaveBeenCalled();
  });
});
