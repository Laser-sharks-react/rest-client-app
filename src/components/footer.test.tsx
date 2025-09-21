import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

jest.mock('../../public/rss-logo.svg', () => '/rss-logo.svg', {
  virtual: true,
});

describe('Footer', () => {
  test('renders two external links, year text, and RSS image with translated alt', async () => {
    const tree = await Footer();
    render(tree);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    const hrefs = links.map(a => a.getAttribute('href'));
    expect(hrefs).toContain(
      'https://github.com/Laser-sharks-react/rest-client-app'
    );
    expect(hrefs).toContain('https://rs.school/courses/reactjs');
    links.forEach(a => expect(a).toHaveAttribute('target', '_blank'));

    expect(screen.getByText('2025')).toBeInTheDocument();

    const img = screen.getByRole('img', { name: 'Footer.rss' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/rss-logo.svg');
  });
});
