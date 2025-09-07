import { type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'session';

function getSecret(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function getUserIdFromRequest(
  req: NextRequest
): Promise<string | null> {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = getSecret();
  if (!raw || !secret) return null;

  try {
    const { payload } = await jwtVerify(raw, secret);
    const userId = payload.userId;
    return typeof userId === 'string' && userId.length > 0 ? userId : null;
  } catch {
    return null;
  }
}
