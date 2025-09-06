import { Footer } from '@/components/footer';
import Header from '@/components/header';
import { RestClientNavbar } from '@/components/rest-client-navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const { messages } = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <RestClientNavbar />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
