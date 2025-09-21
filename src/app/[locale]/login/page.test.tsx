import { fireEvent, render, screen } from '@testing-library/react';
import LoginPage from './page';
import { ROUTES } from '@/lib/constants/routes';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LoginPage', () => {
  test('renders title and link to signup page', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('heading', { name: 'LoginPage.title', level: 2 })
    ).toBeInTheDocument();

    const signupLink = screen.getByRole('link', { name: 'Form.signup' });
    expect(signupLink).toHaveAttribute('href', ROUTES.signup);
  });

  test("change password's visibility", () => {
    render(<LoginPage />);

    const passwordNode = screen.getByLabelText('Form.password');
    if (!(passwordNode instanceof HTMLInputElement)) {
      throw new Error('Expected password input to be an HTMLInputElement');
    }
    expect(passwordNode.type).toBe('password');

    const showButton = screen.getByRole('button', {
      name: 'Form.showPassword',
    });
    fireEvent.click(showButton);

    const passwordAfterNode = screen.getByLabelText('Form.password');
    if (!(passwordAfterNode instanceof HTMLInputElement)) {
      throw new Error('Expected password input to be an HTMLInputElement');
    }
    expect(passwordAfterNode.type).toBe('text');
    expect(
      screen.getByRole('button', { name: 'Form.hidePassword' })
    ).toBeInTheDocument();
  });

  test('button submit is disabled by default', () => {
    render(<LoginPage />);

    const submitBtn = screen.getByRole('button', { name: 'Form.login' });
    expect(submitBtn).toBeDisabled();
  });
});
