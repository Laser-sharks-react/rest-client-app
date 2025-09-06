import { Footer } from '@/components/footer';
import Header from '@/components/header';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const { messages } = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
