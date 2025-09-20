import { render, screen } from '@testing-library/react';
import LoadingScreen from './loading-screen';

describe('LoadingScreen', () => {
  test('renders a circular progress indicator', () => {
    render(<LoadingScreen />);

    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  test('centers the spinner using container classes', () => {
    const { container } = render(<LoadingScreen />);

    const wrapper = container.firstElementChild;
    if (!(wrapper instanceof HTMLElement)) {
      throw new Error('Expected wrapper element');
    }

    const cls = wrapper.className;
    expect(cls).toContain('h-screen');
    expect(cls).toContain('flex');
    expect(cls).toContain('items-center');
    expect(cls).toContain('justify-center');
  });
});
