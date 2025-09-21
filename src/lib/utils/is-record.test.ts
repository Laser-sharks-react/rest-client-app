import { isRecord } from '@/lib/utils/is-record';

describe('isRecord', () => {
  it('returns true for plain objects', () => {
    expect(isRecord({ foo: 'bar' })).toBe(true);
    expect(isRecord({})).toBe(true);
  });

  it('returns false for null and arrays', () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord([1, 2, 3])).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isRecord('string')).toBe(false);
    expect(isRecord(123)).toBe(false);
    expect(isRecord(true)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
  });
});
