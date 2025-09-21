import { ALG, COOKIE_TIME } from '@/lib/constants/cookie';
import { getSessionSecret } from './get-session-secret';
import { type JWTPayload, SignJWT } from 'jose';

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
