import { type NextRequest, NextResponse } from 'next/server';

export function redirectWithLocale(
  req: NextRequest,
  locale: string,
  targetPath: string
) {
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${targetPath}`;
  return NextResponse.redirect(url);
}
