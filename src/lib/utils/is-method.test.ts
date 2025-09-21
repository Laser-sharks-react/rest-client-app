import { isMethod } from '@/lib/utils/is-method';
import { HTTP_METHODS } from '@/lib/constants/request';

describe('isMethod', () => {
  it('returns true for each supported method', () => {
    for (const method of HTTP_METHODS) {
      expect(isMethod(method)).toBe(true);
    }
  });

  it('returns false for strings not in list', () => {
    expect(isMethod('OPTIONS')).toBe(false);
    expect(isMethod('get')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isMethod(null)).toBe(false);
    expect(isMethod(undefined)).toBe(false);
    expect(isMethod(123)).toBe(false);
    expect(isMethod({})).toBe(false);
  });
});
