import { type NextRequest, NextResponse } from 'next/server';
import { withLocale } from './i18nPath';

export function redirectWithLocale(
  req: NextRequest,
  locale: string,
  targetPath: string
) {
  const url = req.nextUrl.clone();
  url.pathname = withLocale(locale, targetPath);
  return NextResponse.redirect(url);
}
