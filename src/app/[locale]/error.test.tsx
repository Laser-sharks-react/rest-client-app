import { render, screen } from '@testing-library/react';
import ErrorPage from './error';

describe('ErrorPage', () => {
  test('renders title and description from translations', () => {
    render(<ErrorPage />);

    expect(
      screen.getByRole('heading', { name: 'ErrorPage.title', level: 1 })
    ).toBeInTheDocument();

    expect(screen.getByText('ErrorPage.description')).toBeInTheDocument();
  });

  test('has a link back to home', () => {
    render(<ErrorPage />);
    const homeLink = screen.getByRole('link', { name: 'ErrorPage.goHome' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
