import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { jwtVerify } from 'jose';
import { ROUTES } from './sources/routes';
import { isLocale } from './i18n/utils';

const handleI18n = createIntlMiddleware(routing);
const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

function buildPatterns() {
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

export default async function middleware(req: NextRequest) {
  const i18nResponse = handleI18n(req);

  const locale = extractLocale(req);
  const { protected: protectedPatterns, public: publicPatterns } =
    buildPatterns();

  const pathname = req.nextUrl.pathname;
  const isProtected = protectedPatterns.includes(pathname);
  const isPublic = publicPatterns.includes(pathname);

  const raw = req.cookies.get('session')?.value;
  let userId = null;
  if (raw) {
    try {
      const { payload } = await jwtVerify(raw, secret);
      userId = payload?.userId;
    } catch {
      userId = null;
    }
  }

  if (isProtected && !userId) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/${ROUTES.login}`;
    return NextResponse.redirect(url);
  }

  if (isPublic && userId) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/${ROUTES.home}`;
    return NextResponse.redirect(url);
  }

  return i18nResponse;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
