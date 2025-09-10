import { type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { parsePath } from '@/utils/parse-path';
import { getUserIdFromRequest } from '@/utils/get-user-id-from-request';
import { isProtectedRoute, isPublicRoute } from '@/utils/access-routes';
import { redirectWithLocale } from '@/utils/redirect';
import { ROUTES } from './lib/constants/routes';

const handleI18n = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const i18nResponse = handleI18n(req);

  const [locale, path] = parsePath(req.nextUrl.pathname);

  const userId = await getUserIdFromRequest(req);

  const isProtected = isProtectedRoute(`/${path}`);
  const isPublic = isPublicRoute(`/${path}`);

  if (isProtected && !userId) {
    return redirectWithLocale(req, locale, ROUTES.login);
  }

  if (isPublic && userId) {
    return redirectWithLocale(req, locale, ROUTES.home);
  }

  return i18nResponse;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
