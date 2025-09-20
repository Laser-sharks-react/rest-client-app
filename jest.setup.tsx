import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

import React, { forwardRef, type ReactNode } from 'react';

type Router = {
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
};

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

  const useRouter = (): Router => ({
    push: () => {},
    replace: () => {},
    back: () => {},
  });

  return { __esModule: true as const, Link, useRouter };
});

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(async (namespace?: string) => {
    return (key: string) => `${namespace ? `${namespace}.` : ''}${key}`;
  }),
}));

jest.mock('@/lib/firebase', () => {
  const login = jest.fn<Promise<void>, [string, string]>(() =>
    Promise.resolve()
  );
  const getLoginMock = () => login;
  return { __esModule: true as const, login, getLoginMock };
});
