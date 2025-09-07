import { type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getLocaleFromPath, stripLocale } from '@/utils/i18nPath';
import { getUserIdFromRequest } from '@/utils/authSession';
import {
  buildAccessPatterns,
  isProtectedPath,
  isPublicPath,
} from '@/utils/access';
import { redirectWithLocale } from '@/utils/redirect';
import { ROUTES } from '@/sources/routes';

const handleI18n = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const i18nResponse = handleI18n(req);

  const locale = getLocaleFromPath(req.nextUrl.pathname);
  const pathnameNoLocale = stripLocale(req.nextUrl.pathname);
  const patterns = buildAccessPatterns();
  const userId = await getUserIdFromRequest(req);

  const protectedRoute = isProtectedPath(pathnameNoLocale, patterns);
  const publicRoute = isPublicPath(pathnameNoLocale, patterns);

  if (protectedRoute && !userId) {
    return redirectWithLocale(req, locale, ROUTES.login);
  }
  if (publicRoute && userId) {
    return redirectWithLocale(req, locale, ROUTES.home);
  }

  return i18nResponse;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
