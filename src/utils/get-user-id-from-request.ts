import { type NextRequest } from 'next/server';

import { jwtVerify } from 'jose';
import { getSessionCookie } from './session-token';
import { ALG } from '@/sources/constants';

function getSigningSecret(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  return secret ? new TextEncoder().encode(secret) : null;
}

export async function getUserIdFromRequest(
  req: NextRequest
): Promise<string | null> {
  const token = getSessionCookie(req);
  const secret = getSigningSecret();
  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [ALG] });

    const userId = payload.userId;
    const isValidId = typeof userId === 'string' && userId.length > 0;

    return isValidId ? userId : null;
  } catch {
    return null;
  }
}
