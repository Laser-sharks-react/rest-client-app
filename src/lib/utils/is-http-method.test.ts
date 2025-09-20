import { describe, it, expect } from '@jest/globals';
import { isHttpMethod } from './is-http-method';

describe('isHttpMethod', () => {
  it('returns true for valid methods (uppercase)', () => {
    expect(isHttpMethod('GET')).toBe(true);
    expect(isHttpMethod('POST')).toBe(true);
    expect(isHttpMethod('PUT')).toBe(true);
    expect(isHttpMethod('PATCH')).toBe(true);
    expect(isHttpMethod('DELETE')).toBe(true);
  });

  it('returns true regardless of the case of the string', () => {
    expect(isHttpMethod('get')).toBe(true);
    expect(isHttpMethod('pOsT')).toBe(true);
    expect(isHttpMethod('Put')).toBe(true);
  });

  it('returns false for unknown methods', () => {
    expect(isHttpMethod('OPTIONS')).toBe(false);
    expect(isHttpMethod('HEAD')).toBe(false);
    expect(isHttpMethod('FETCH')).toBe(false);
  });

  it('returns false for non-strings', () => {
    expect(isHttpMethod(123)).toBe(false);
    expect(isHttpMethod({})).toBe(false);
    expect(isHttpMethod([])).toBe(false);
    expect(isHttpMethod(null)).toBe(false);
    expect(isHttpMethod(undefined)).toBe(false);
  });

  it('returns false for empty strings and strings with extra spaces', () => {
    expect(isHttpMethod('')).toBe(false);
    expect(isHttpMethod(' get')).toBe(false);
    expect(isHttpMethod('get ')).toBe(false);
    expect(isHttpMethod(' get ')).toBe(false);
  });
});
