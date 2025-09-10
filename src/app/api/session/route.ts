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
  setSessionToken(res, token);

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  setSessionToken(res, '', 0);
  return res;
}
