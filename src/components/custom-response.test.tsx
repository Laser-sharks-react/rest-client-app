import { render, screen } from '@testing-library/react';
import { CustomResponse } from './custom-response';

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: React.ReactNode }) => (
    <pre data-testid="code">{children}</pre>
  ),
}));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  const Chip = ({
    label,
    color,
    size,
  }: {
    label: React.ReactNode;
    color?:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning';
    size?: 'small' | 'medium';
  }) => (
    <div data-testid="chip" data-color={color} data-size={size}>
      {label}
    </div>
  );
  return { ...actual, Chip };
});

describe('CustomResponse', () => {
  test('renders title, status chip (primary) and JSON body', () => {
    const response = {
      status: 200,
      ok: true,
      json: { data: 'testData' },
    };

    render(<CustomResponse response={response} />);

    expect(
      screen.getByRole('heading', { name: 'Response.response', level: 5 })
    ).toBeInTheDocument();

    const chip = screen.getByTestId('chip');
    expect(chip).toHaveTextContent('200');
    expect(chip).toHaveAttribute('data-color', 'primary');

    const code = screen.getByTestId('code');
    expect(code).toHaveTextContent('"status": 200');
    expect(code).toHaveTextContent('"ok": true');
    expect(code).toHaveTextContent('"data": "testData"');
  });

  test('uses error color for status >= 400', () => {
    const response = {
      status: 404,
      ok: false,
      json: { message: 'Not Found' },
    };

    render(<CustomResponse response={response} />);

    const chip = screen.getByTestId('chip');
    expect(chip).toHaveTextContent('404');
    expect(chip).toHaveAttribute('data-color', 'error');

    const code = screen.getByTestId('code');
    expect(code).toHaveTextContent('"status": 404');
    expect(code).toHaveTextContent('"message": "Not Found"');
  });

  test('renders without chip when status is missing', () => {
    const response = {
      status: 0,
      ok: true,
      json: {},
    };

    render(<CustomResponse response={response} />);

    expect(screen.queryByTestId('chip')).toBeNull();
    expect(screen.getByTestId('code')).toHaveTextContent('"ok": true');
  });
});
