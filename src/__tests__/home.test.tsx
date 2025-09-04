import { render, screen } from '@testing-library/react';
import HomePage from '@/app/[locale]/page';

describe('HomePage', () => {
  it('renders intro text', () => {
    render(<HomePage />);
    expect(screen.getByText(/get started by editing/i)).toBeInTheDocument();
  });
});
