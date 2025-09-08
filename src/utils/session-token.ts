import { COOKIE_TIME, COOKIES } from '@/sources/constants';
import { type NextResponse, type NextRequest } from 'next/server';

export const getSessionCookie = (req: NextRequest): string | null =>
  req.cookies.get(COOKIES.session)?.value ?? null;

export const setSessionCookie = (
  res: NextResponse,
  token: string,
  maxAge = COOKIE_TIME
) =>
  res.cookies.set(COOKIES.session, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
