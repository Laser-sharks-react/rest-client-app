import { searchParamsToHeadersObj } from '@/lib/utils/normalize-headers';

describe('searchParamsToHeadersObj', () => {
  it('returns empty object when no params provided', () => {
    const result = searchParamsToHeadersObj({});

    expect(result).toEqual({});
  });

  it('copies string values directly', () => {
    const result = searchParamsToHeadersObj({ Authorization: 'Bearer token' });

    expect(result).toEqual({ Authorization: 'Bearer token' });
  });

  it('joins array values with comma and space', () => {
    const result = searchParamsToHeadersObj({
      Accept: ['application/json', 'text/plain'],
    });

    expect(result).toEqual({ Accept: 'application/json, text/plain' });
  });

  it('skips undefined values', () => {
    const result = searchParamsToHeadersObj({
      Referer: undefined,
      Host: 'example.com',
    });

    expect(result).toEqual({ Host: 'example.com' });
  });
});
