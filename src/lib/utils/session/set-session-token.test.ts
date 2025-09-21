/**
 * @jest-environment node
 */

import { NextResponse } from 'next/server';
import { setSessionToken } from '@/lib/utils/session/set-session-token';
import { COOKIES, COOKIE_TIME } from '@/lib/constants/cookie';

describe('setSessionToken', () => {
  const realEnv = process.env;
  const token = 'jwt-token-123';

  beforeEach(() => {
    jest.restoreAllMocks();
    process.env = { ...realEnv, NODE_ENV: 'test' };
  });
  afterEach(() => {
    process.env = realEnv;
  });

  it('sets cookies', () => {
    const res = NextResponse.json({ ok: true });

    setSessionToken(res, token);
    const cookie = res.cookies.get(COOKIES.session);
    expect(cookie).toMatchObject({
      name: COOKIES.session,
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_TIME,
    });
  });
});
