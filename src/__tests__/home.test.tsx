import { render, screen } from '@testing-library/react';
import HomePage from '@/app/[locale]/page';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';

describe('HomePage', () => {
  it('renders intro text', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HomePage />
      </NextIntlClientProvider>
    );
    expect(screen.getByText(messages.HomePage.title)).toBeInTheDocument();
  });
});
