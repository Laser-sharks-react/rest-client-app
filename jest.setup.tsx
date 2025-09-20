import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

import React, { forwardRef, type ReactNode } from 'react';

type Router = {
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
};

jest.mock('next/navigation', () => {
  const router: Router = {
    push: () => {},
    replace: () => {},
    back: () => {},
  };

  return {
    useRouter: () => router,
    usePathname: (): string => '/',
    useSearchParams: (): URLSearchParams => new URLSearchParams(),
    redirect: (_url: string): void => {},
    notFound: (): void => {},
  };
});

jest.mock('next-intl', () => {
  return {
    useTranslations:
      (namespace?: string) =>
      (key: string): string =>
        `${namespace ? `${namespace}.` : ''}${key}`,

    NextIntlClientProvider: ({ children }: { children: ReactNode }) => children,
  };
});

jest.mock('@/i18n/navigation', () => {
  const Link = forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >(function LinkImpl({ href, children, ...rest }, ref) {
    return (
      <a ref={ref} href={typeof href === 'string' ? href : undefined} {...rest}>
        {children}
      </a>
    );
  });
  return { __esModule: true, Link };
});

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(async (namespace?: string) => {
    return (key: string) => `${namespace ? `${namespace}.` : ''}${key}`;
  }),
}));
