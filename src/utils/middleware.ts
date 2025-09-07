import { routing } from '@/i18n/routing';
import { isLocale } from '@/i18n/utils';
import { ROUTES } from '@/sources/routes';
import type { NextRequest } from 'next/server';

export function buildPatterns() {
  return {
    protected: [ROUTES.history],
    public: [ROUTES.login, ROUTES.signup],
  };
}

export function extractLocale(
  req: NextRequest
): (typeof routing.locales)[number] {
  const [, first] = req.nextUrl.pathname.split('/');
  return isLocale(first) ? first : routing.defaultLocale;
}

export function extractPath(pathname: string) {
  const parts = pathname.split('/');
  return '/' + parts.slice(2).join('/');
}
