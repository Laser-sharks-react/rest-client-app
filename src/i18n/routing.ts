import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru'] as const,
  defaultLocale: 'en' as const,
  localePrefix: 'always',
});
