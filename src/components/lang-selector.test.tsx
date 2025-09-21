import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LangSelector } from './lang-selector';

describe('LangSelector', () => {
  test('menu is closed by default, clicking it opens it with all locales', () => {
    render(<LangSelector />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'en' })
    ).not.toBeInTheDocument();

    const toggleBtn = screen.getByRole('button');
    fireEvent.click(toggleBtn);

    const menu = screen.getByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    expect(
      within(menu).getByRole('menuitem', { name: 'en' })
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole('menuitem', { name: 'ru' })
    ).toBeInTheDocument();
  });

  test('each item is link to the current pathname', () => {
    render(<LangSelector />);
    fireEvent.click(screen.getByRole('button'));

    const menu = screen.getByRole('menu');
    const items = within(menu).getAllByRole('menuitem');

    for (const item of items) {
      expect(item).toHaveAttribute('href', '/foo');
    }
  });

  test('click on item closes the menu', () => {
    render(<LangSelector />);
    fireEvent.click(screen.getByRole('button'));

    const menu = screen.getByRole('menu');
    const ruItem = within(menu).getByRole('menuitem', { name: 'ru' });
    fireEvent.click(ruItem);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
