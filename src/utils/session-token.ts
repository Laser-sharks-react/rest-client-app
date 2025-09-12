import { ALG, COOKIE_TIME, COOKIES } from '@/lib/constants';
import { type JWTPayload, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { type NextResponse, type NextRequest } from 'next/server';

export const SESSION_COOKIE = 'session';

export function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: JWTPayload,
  maxAgeSec = COOKIE_TIME
) {
  const now = Math.floor(Date.now() / 1000);
  const secret = getSessionSecret();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt(now)
    .setExpirationTime(now + maxAgeSec)
    .sign(secret);
}

export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value || null;
}

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
