import { type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getSessionSecret, getSessionToken } from './session-token';
import { ALG } from '@/lib/constants';

export async function getUserIdFromRequest(
  req: NextRequest
): Promise<string | null> {
  const token = await getSessionToken();
  const secret = getSessionSecret();
  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [ALG] });
    const userId = payload.userId;
    const isValidUserId = typeof userId === 'string' && userId.length > 0;

    return isValidUserId ? userId : null;
  } catch {
    return null;
  }
}
