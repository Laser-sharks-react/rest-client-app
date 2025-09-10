import { routing } from '@/i18n/routing';
import { isLocale } from '@/i18n/utils';
import type { Locale } from 'next-intl';

export function parsePath(pathname: string): [Locale, string] {
  const [, first, ...rest] = pathname.split('/');

  const locale = isLocale(first) ? first : routing.defaultLocale;
  const path = rest.filter(Boolean).join('/').replace(/\/+/g, '/');

  return [locale, path];
}
