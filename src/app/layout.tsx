import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from '@mui/material';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: `by ${process.env.NEXT_PUBLIC_TEAM_NAME}`,
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <CssBaseline />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
