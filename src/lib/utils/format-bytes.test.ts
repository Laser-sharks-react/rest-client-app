import { formatBytes } from '@/lib/utils/format-bytes';

describe('formatBytes', () => {
  test('returns "-" for invalid and negative values', () => {
    expect(formatBytes(NaN)).toBe('-');
    expect(formatBytes(Infinity)).toBe('-');
    expect(formatBytes(-1)).toBe('-');
  });

  test('bytes (< 1024)', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1)).toBe('1 B');
    expect(formatBytes(42)).toBe('42 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  test('kilobytes (one decimal place)', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(10 * 1024 + 512)).toBe('10.5 KB');

    expect(formatBytes(1048575)).toBe('1024.0 KB');
  });

  test('megabytes (one decimal place)', () => {
    expect(formatBytes(1048576)).toBe('1.0 MB');
    expect(formatBytes(1572864)).toBe('1.5 MB');
  });
});
