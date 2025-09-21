jest.mock('jose', () => ({ jwtVerify: jest.fn() }));
jest.mock('@/lib/utils/session/get-session-token', () => ({
  getSessionToken: jest.fn(),
}));
jest.mock('@/lib/utils/session/get-session-secret', () => ({
  getSessionSecret: jest.fn(),
}));

import { getUserId } from '@/lib/utils/session/get-user-id';
import { ALG } from '@/lib/constants/cookie';
import { jwtVerify } from 'jose';
import { getSessionToken } from '@/lib/utils/session/get-session-token';
import { getSessionSecret } from '@/lib/utils/session/get-session-secret';

type JwtVerifyResult = Awaited<ReturnType<typeof jwtVerify>>;
const mockedJwtVerify = jest.mocked(jwtVerify);
const mockedGetSessionToken = jest.mocked(getSessionToken);
const mockedGetSessionSecret = jest.mocked(getSessionSecret);

const SECRET = new Uint8Array([1, 2, 3]);
const createVerifyResult = (
  payload: JwtVerifyResult['payload']
): JwtVerifyResult => ({
  payload,
  protectedHeader: { alg: ALG },
  key: SECRET,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getUserId', () => {
  it('returns null when no token is present', async () => {
    mockedGetSessionToken.mockResolvedValue(null);

    const result = await getUserId();

    expect(result).toBeNull();
    expect(mockedJwtVerify).not.toHaveBeenCalled();
  });

  it('returns userId when token is valid', async () => {
    mockedGetSessionToken.mockResolvedValue('token-123');
    mockedGetSessionSecret.mockReturnValue(SECRET);
    mockedJwtVerify.mockResolvedValue(createVerifyResult({ userId: 'user-1' }));

    const result = await getUserId();

    expect(result).toBe('user-1');
    expect(mockedJwtVerify).toHaveBeenCalledWith('token-123', SECRET, {
      algorithms: [ALG],
    });
  });

  it('returns null when token validation fails', async () => {
    mockedGetSessionToken.mockResolvedValue('bad-token');
    mockedGetSessionSecret.mockReturnValue(SECRET);
    mockedJwtVerify.mockRejectedValue(new Error('invalid token'));

    const result = await getUserId();

    expect(result).toBeNull();
  });

  it('returns null when userId is missing or invalid', async () => {
    mockedGetSessionToken.mockResolvedValue('token-123');
    mockedGetSessionSecret.mockReturnValue(SECRET);

    mockedJwtVerify
      .mockResolvedValueOnce(createVerifyResult({}))
      .mockResolvedValueOnce(createVerifyResult({ userId: '' }))
      .mockResolvedValueOnce(createVerifyResult({ userId: 123 }));

    expect(await getUserId()).toBeNull();
    expect(await getUserId()).toBeNull();
    expect(await getUserId()).toBeNull();
  });
});
