import { routing } from './routing';

export const isLocale = (
  val: string
): val is (typeof routing.locales)[number] => {
  return routing.locales.some(locale => locale === val);
};
