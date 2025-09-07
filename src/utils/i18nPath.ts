import { routing } from '@/i18n/routing';
import { isLocale } from '@/i18n/utils';
import type { Locale } from 'next-intl';

export function getLocaleFromPath(pathname: string): Locale {
  const [, first = ''] = pathname.split('/');
  if (isLocale(first)) return first;
  return routing.defaultLocale;
}

export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && isLocale(parts[0])) {
    return '/' + parts.slice(1).join('/');
  }
  return '/' + parts.join('/');
}

export function withLocale(locale: string, path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}/${clean}`.replace(/\/+/g, '/');
}
