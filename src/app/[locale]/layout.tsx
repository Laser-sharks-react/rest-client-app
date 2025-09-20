import { ClientProviders } from '@/components/client-layout';
import { Footer } from '@/components/footer';
import Header from '@/components/header';
import { RestClientNavbar } from '@/components/rest-client-navbar';
import { Container } from '@mui/material';
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
      <ClientProviders />
      <Header />
      <RestClientNavbar />
      <div className="bg-blue-100">
        <Container component="main" sx={{ minHeight: '80dvh', p: 2 }}>
          {children}
        </Container>
      </div>
      <Footer />
    </NextIntlClientProvider>
  );
}
