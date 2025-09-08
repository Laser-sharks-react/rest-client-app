import { NextResponse } from 'next/server';
import { createSessionToken, setSessionToken } from '@/utils/session-token';

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId)
    return NextResponse.json(
      { ok: false, error: 'userId required' },
      { status: 400 }
    );

  const token = await createSessionToken({ userId });
  const res = NextResponse.json({ ok: true });
  const resWithSession = setSessionToken(res, token);

  return resWithSession;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const resWithSession = setSessionToken(res, '', 0);
  return resWithSession;
}
