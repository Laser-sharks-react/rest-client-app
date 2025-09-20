import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { base64Encode, base64Decode } from './base64';

describe('base64Encode', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('base64Encode encodes an ASCII string', () => {
    expect(base64Encode('Hello')).toBe('SGVsbG8=');
  });

  it('base64Encode returns an empty string for empty input', () => {
    expect(base64Encode('')).toBe('');
  });
});

describe('base64Decode', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('base64Decode decodes a known base64 string', () => {
    expect(base64Decode('SGVsbG8sIHdvcmxkIQ==')).toBe('Hello, world!');
  });

  it('returns an empty string on decoding error ', () => {
    const originalFrom = Buffer.from;
    Buffer.from = jest.fn(() => {
      throw new Error('bad base64');
    });
    expect(base64Decode('not-base64')).toBe('');
    Buffer.from = originalFrom;
  });
});
