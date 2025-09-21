import { render, screen } from '@testing-library/react';
import NotFound from './not-found';
import { ROUTES } from '@/lib/constants/routes';

describe('NotFoundPage', () => {
  test('renders title and description from translations', async () => {
    const tree = await NotFound();
    render(tree);

    expect(
      screen.getByRole('heading', { name: 'NotFoundPage.title', level: 5 })
    ).toBeInTheDocument();

    expect(screen.getByText('NotFoundPage.description')).toBeInTheDocument();
  });

  test('has a “go home” link with correct href', async () => {
    const tree = await NotFound();
    render(tree);

    const link = screen.getByRole('link', { name: 'NotFoundPage.goHome' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.home);
  });
});
