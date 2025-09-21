import { render, screen, fireEvent } from '@testing-library/react';
import SignUpPage from './page';
import { ROUTES } from '@/lib/constants/routes';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignUpPage', () => {
  test('renders title and link to login page', () => {
    render(<SignUpPage />);

    expect(
      screen.getByRole('heading', { name: 'SignUpPage.title', level: 2 })
    ).toBeInTheDocument();

    const loginLink = screen.getByRole('link', { name: 'Form.login' });
    expect(loginLink).toHaveAttribute('href', ROUTES.login);
  });

  test("changes password's visibility", () => {
    render(<SignUpPage />);

    const passwordNode = screen.getByLabelText('Form.password');
    if (!(passwordNode instanceof HTMLInputElement)) {
      throw new Error('Expected password input to be an HTMLInputElement');
    }
    expect(passwordNode.type).toBe('password');

    const showBtn = screen.getByRole('button', { name: 'Form.showPassword' });
    fireEvent.click(showBtn);

    const passwordAfterNode = screen.getByLabelText('Form.password');
    if (!(passwordAfterNode instanceof HTMLInputElement)) {
      throw new Error('Expected password input to be an HTMLInputElement');
    }
    expect(passwordAfterNode.type).toBe('text');
    expect(
      screen.getByRole('button', { name: 'Form.hidePassword' })
    ).toBeInTheDocument();
  });

  test('submit button is disabled by default', () => {
    render(<SignUpPage />);
    const submitBtn = screen.getByRole('button', { name: 'Form.signup' });
    expect(submitBtn).toBeDisabled();
  });
});
