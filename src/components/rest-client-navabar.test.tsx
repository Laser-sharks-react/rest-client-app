import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RestClientNavbar } from './rest-client-navbar';
import * as MUI from '@mui/material';

jest.mock('@/lib/firebase', () => ({ auth: {} }));
const useAuthStateMock = jest.fn();
jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: (...args: unknown[]) => useAuthStateMock(...args),
}));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useScrollTrigger: jest.fn(() => false),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStateMock.mockReturnValue([null, false, undefined]);
});

describe('RestClientNavbar ', () => {
  test('returns null when user is not authenticated', () => {
    const { container } = render(<RestClientNavbar />);
    expect(container.firstChild).toBeNull();
  });

  test('renders 3 nav links when user is authenticated', () => {
    useAuthStateMock.mockReturnValue([{ uid: 'id1' }, false, undefined]);

    render(<RestClientNavbar />);

    const reqLink = screen.getByRole('link', {
      name: 'RestClientLayout.request',
    });
    const varsLink = screen.getByRole('link', {
      name: 'RestClientLayout.variables',
    });
    const histLink = screen.getByRole('link', {
      name: 'RestClientLayout.history',
    });

    expect(reqLink).toHaveAttribute('href', '/request');
    expect(varsLink).toHaveAttribute('href', '/variables');
    expect(histLink).toHaveAttribute('href', '/history');

    const toolbar = document.querySelector('.MuiToolbar-root');
    expect(toolbar).toBeTruthy();

    expect(toolbar!.className).toMatch(/bg-blue-200/);
    expect(toolbar!.className).not.toMatch(/bg-blue-300/);
  });

  test('adds bg-blue-300 when useScrollTrigger is true', () => {
    useAuthStateMock.mockReturnValue([{ uid: 'id1' }, false, undefined]);

    jest.mocked(MUI.useScrollTrigger).mockReturnValueOnce(true);

    render(<RestClientNavbar />);

    const toolbar = document.querySelector('.MuiToolbar-root');

    expect(toolbar).toBeTruthy();
    expect(toolbar!.className).toMatch(/bg-blue-300/);
    expect(toolbar!.className).not.toMatch(/bg-blue-200/);
  });
});
