import { NextResponse } from 'next/server';
import { type JWTPayload, SignJWT } from 'jose';
import { ALG, COOKIE_TIME } from '@/sources/constants';
import { setSessionCookie } from '@/utils/session-token';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

async function sign(payload: JWTPayload, maxAgeSec: number) {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt(now)
    .setExpirationTime(now + maxAgeSec)
    .sign(secret);
}

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: 'userId required' },
      { status: 400 }
    );
  }
  const token = await sign({ userId }, COOKIE_TIME);
  const res = NextResponse.json({ ok: true });
  const resWithCookie = setSessionCookie(res, token);

  return resWithCookie;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const resWithCookie = setSessionCookie(res, '', 0);
  return resWithCookie;
}
