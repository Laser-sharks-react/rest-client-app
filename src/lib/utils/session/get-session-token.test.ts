import { COOKIES } from '@/lib/constants/cookie';

let cookiesImpl: () => Promise<{
  get: (name: string) => { value: string } | undefined;
}>;

jest.mock('next/headers', () => ({
  cookies: () => cookiesImpl(),
}));

import { getSessionToken } from '@/lib/utils/session/get-session-token';

describe('getSessionToken', () => {
  test('returns the cookie value if it exists', async () => {
    cookiesImpl = async () => ({
      get: name =>
        name === COOKIES.session ? { value: 'token-123' } : undefined,
    });

    const result = await getSessionToken();
    expect(result).toBe('token-123');
  });

  test('returns null if the cookie is missing', async () => {
    cookiesImpl = async () => ({
      get: () => undefined,
    });

    const result = await getSessionToken();
    expect(result).toBeNull();
  });

  test('returns null if the cookie exists but is empty', async () => {
    cookiesImpl = async () => ({
      get: name => (name === COOKIES.session ? { value: '' } : undefined),
    });

    const result = await getSessionToken();
    expect(result).toBeNull();
  });
});
