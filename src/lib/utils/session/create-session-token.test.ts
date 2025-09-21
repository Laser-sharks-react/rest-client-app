/**
 * @jest-environment node
 */

import type { JWTPayload } from 'jose';

const setProtectedHeader = jest.fn();
const setIssuedAt = jest.fn();
const setExpirationTime = jest.fn();
const sign = jest.fn();

jest.mock('jose', () => ({
  SignJWT: jest.fn(() => ({
    setProtectedHeader,
    setIssuedAt,
    setExpirationTime,
    sign,
  })),
}));

import { createSessionToken } from '@/lib/utils/session/create-session-token';
import { ALG, COOKIE_TIME } from '@/lib/constants/cookie';

describe('createSessionToken (use real ALG and COOKIE_TIME)', () => {
  let nowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    jest.restoreAllMocks();

    setProtectedHeader.mockReturnValue({
      setIssuedAt,
      setExpirationTime,
      sign,
    });
    setIssuedAt.mockReturnValue({ setExpirationTime, sign });
    setExpirationTime.mockReturnValue({ sign });
    sign.mockResolvedValue('signed.jwt.token');

    nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
  });

  afterEach(() => {
    nowSpy.mockRestore();
    setProtectedHeader.mockReset();
    setIssuedAt.mockReset();
    setExpirationTime.mockReset();
    sign.mockReset();
  });

  it('creates a token with explicit maxAgeSec', async () => {
    const payload: JWTPayload = { sub: 'user-1', scope: 'admin' };
    const nowSec = Math.floor(1_700_000_000_000 / 1000);
    const maxAgeSec = 1234;

    const token = await createSessionToken(payload, maxAgeSec);

    expect(token).toBe('signed.jwt.token');
    expect(setProtectedHeader).toHaveBeenCalledWith({ alg: ALG });
    expect(setIssuedAt).toHaveBeenCalledWith(nowSec);
    expect(setExpirationTime).toHaveBeenCalledWith(nowSec + maxAgeSec);
  });

  it('uses COOKIE_TIME if maxAgeSec is not passed in', async () => {
    const payload: JWTPayload = { sub: 'user-2' };
    const nowSec = Math.floor(1_700_000_000_000 / 1000);

    await createSessionToken(payload);

    expect(setExpirationTime).toHaveBeenCalledWith(nowSec + COOKIE_TIME);
  });
});
