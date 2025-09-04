import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

jest.mock('@/firebase', () => ({
  auth: {},
  registerWithEmailAndPassword: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false, null],
}));

describe('HomePage', () => {
  it('renders intro text', () => {
    render(<HomePage />);
    expect(screen.getByText(/get started by editing/i)).toBeInTheDocument();
  });
});
