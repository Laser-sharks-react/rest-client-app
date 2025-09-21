import { COOKIE_TIME, COOKIES } from '@/lib/constants/cookie';
import { type NextResponse } from 'next/server';

export const setSessionToken = (
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
