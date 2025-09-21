import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './header';
import * as MUI from '@mui/material';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useScrollTrigger: jest.fn(() => false),
  };
});

jest.mock('@/components/lang-selector', () => ({
  LangSelector: () => <div data-testid="lang-selector" />,
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false, undefined],
}));

const enqueueSnackbarMock = jest.fn();
jest.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: enqueueSnackbarMock }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  process.env.NEXT_PUBLIC_APP_NAME = 'Shark Bite';
});

describe('Header', () => {
  test('renders logo, app name, lang selector', () => {
    render(<Header />);
    expect(screen.getByText('Shark Bite')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toBeInTheDocument();

    const homeLink = screen.getByText('Shark Bite').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');

    expect(screen.getByTestId('lang-selector')).toBeInTheDocument();
  });

  test('renders Login link to /login when user is not authenticated', () => {
    render(<Header />);

    const loginLink = screen.getByRole('link', { name: 'Header.login' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
    expect(
      screen.queryByRole('link', { name: 'Header.logout' })
    ).not.toBeInTheDocument();
  });

  test('useScrollTrigger=true adds class bg-blue-200 on Toolbar', () => {
    jest.mocked(MUI.useScrollTrigger).mockReturnValueOnce(true);

    render(<Header />);

    const header = screen.getByRole('banner');
    const toolbar = header.querySelector('.MuiToolbar-root');
    if (!(toolbar instanceof HTMLElement)) {
      throw new Error('Expected toolbar element');
    }
    expect(toolbar).toBeInTheDocument();
    expect(toolbar.className).toMatch(/bg-blue-200/);
  });
});
