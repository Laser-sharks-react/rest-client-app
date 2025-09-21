import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';
import * as React from 'react';

type Router = {
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
};

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  replace?: boolean;
  prefetch?: boolean;
  shallow?: boolean;
  scroll?: boolean;
  locale?: string;
};

jest.mock('next-intl', () => {
  return {
    useTranslations:
      (namespace?: string) =>
      (key: string): string =>
        `${namespace ? `${namespace}.` : ''}${key}`,

    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
      children,
  };
});

jest.mock('@/i18n/navigation', () => {
  const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function LinkImpl(
    { href, children, ...rest },
    ref
  ) {
    const {
      replace: _replace,
      prefetch: _prefetch,
      shallow: _shallow,
      scroll: _scroll,
      locale: _locale,
      ...anchorProps
    } = rest;
    return (
      <a
        ref={ref}
        href={typeof href === 'string' ? href : undefined}
        {...anchorProps}
      >
        {children}
      </a>
    );
  });

  const useRouter = (): Router => ({
    push: () => {},
    replace: () => {},
    back: () => {},
  });
  const usePathname = () => '/foo';

  return { __esModule: true, Link, useRouter, usePathname };
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
  const auth = { currentUser: null };
  return { __esModule: true, auth, login, getLoginMock };
});

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false, undefined],
}));

jest.mock('next/dynamic', () => () => {
  const MockComponent = (_props: unknown) => null;
  return MockComponent;
});

jest.mock('next/image', () => {
  return function NextImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} />;
  };
});

jest.mock('@/i18n/routing', () => ({
  __esModule: true,
  routing: { locales: ['en', 'ru'], defaultLocale: 'en' },
}));

jest.mock('@/i18n/utils', () => ({
  __esModule: true,
  isLocale: (v: unknown) => v === 'en' || v === 'ru',
}));

jest.mock('server-only', () => ({}));
