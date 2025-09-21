import { isHttpHeaderArray } from '@/lib/utils/is-http-header-array';

describe('isHttpHeaderArray', () => {
  it('returns true for an array of valid headers', () => {
    const input = [
      { id: '1', key: 'Accept', value: 'application/json' },
      { id: '2', key: 'Retry-After', value: 120 },
      { id: '3', key: 'X-Empty', value: '' },
    ];

    expect(isHttpHeaderArray(input)).toBe(true);
  });

  it('returns false when value is not an array', () => {
    expect(isHttpHeaderArray('not-an-array')).toBe(false);
    expect(isHttpHeaderArray(null)).toBe(false);
    expect(isHttpHeaderArray({})).toBe(false);
  });

  it('returns false when item is not an object', () => {
    const input = [{ id: '1', key: 'Accept', value: 'json' }, 'oops'];

    expect(isHttpHeaderArray(input)).toBe(false);
  });

  it('returns false when key is missing or not a string', () => {
    const missingKey = [{ id: '1', value: 'json' }];
    const nonStringKey = [{ id: '1', key: 123, value: 'json' }];

    expect(isHttpHeaderArray(missingKey)).toBe(false);
    expect(isHttpHeaderArray(nonStringKey)).toBe(false);
  });

  it('returns false when value has unsupported type', () => {
    const booleanValue = [{ id: '1', key: 'Flag', value: true }];

    expect(isHttpHeaderArray(booleanValue)).toBe(false);
  });
});
