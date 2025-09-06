import { render, screen } from '@testing-library/react';
import HomePage from '@/app/[locale]/signup/page';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../messages/en.json';

jest.mock('@/firebase', () => ({
  auth: {},
  registerWithEmailAndPassword: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false, null],
}));

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
