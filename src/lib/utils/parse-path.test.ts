import { describe, it, expect, jest } from '@jest/globals';

import { parsePath } from './parse-path';

describe('parsePath', () => {
  it('returns [locale, path] when the first segment is a valid locale', () => {
    const [locale, path] = parsePath('/en/dashboard/settings');
    expect(locale).toBe('en');
    expect(path).toBe('dashboard/settings');
  });

  it('uses defaultLocale and discards the first segment if it is not localised', () => {
    const [locale, path] = parsePath('/unknown/dashboard');
    expect(locale).toBe('en');
    expect(path).toBe('dashboard');
  });

  it('handles multiple and redundant slashes correctly', () => {
    const [locale, path] = parsePath('/en///a//b///');
    expect(locale).toBe('en');
    expect(path).toBe('a/b');
  });

  it('when the path consists only of a locale, returns an empty path', () => {
    const [locale, path] = parsePath('/ru');
    expect(locale).toBe('ru');
    expect(path).toBe('');
  });

  it('site root without locale → defaultLocale and empty path', () => {
    const [locale, path] = parsePath('/');
    expect(locale).toBe('en');
    expect(path).toBe('');
  });

  it('empty string → defaultLocale and empty path', () => {
    const [locale, path] = parsePath('');
    expect(locale).toBe('en');
    expect(path).toBe('');
  });
});
