/**
 * @jest-environment node
 */

import { getSessionSecret } from '@/lib/utils/session/get-session-secret';

const OLD_ENV = { ...process.env };

describe('getSessionSecret', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    Object.assign(process.env, OLD_ENV);
  });

  afterEach(() => {
    process.env = { ...OLD_ENV };
  });

  it('returns a Uint8Array encoded from SESSION_SECRET', () => {
    process.env.SESSION_SECRET = 'super_secret_123';

    const bytes = getSessionSecret();

    const expected = new TextEncoder().encode('super_secret_123');
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(Array.from(bytes)).toEqual(Array.from(expected));
  });

  it('throws an error if SESSION_SECRET is not set', () => {
    delete process.env.SESSION_SECRET;
    expect(() => getSessionSecret()).toThrow('SESSION_SECRET is not set');
  });
});
