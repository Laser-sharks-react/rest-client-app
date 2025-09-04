import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders home page', () => {
    render(<HomePage />);
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});
