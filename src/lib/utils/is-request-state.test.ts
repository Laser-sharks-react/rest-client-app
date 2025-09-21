import { isRequestState } from '@/lib/utils/is-request-state';
import type { RequestState } from '@/lib/types/request';

const baseRestore: RequestState = {
  url: 'https://example.com',
  method: 'POST',
  body: '{"foo":"bar"}',
  headers: [{ id: 'h1', key: 'Accept', value: 'application/json' }],
};

describe('isRequestState', () => {
  it('returns true when method is not null and headers is an array', () => {
    const restore: RequestState = { ...baseRestore };

    expect(isRequestState(restore)).toBe(true);
  });

  it('returns false when method is null', () => {
    const restoreWithNullMethod = JSON.parse(
      JSON.stringify({ ...baseRestore, method: null })
    );

    expect(isRequestState(restoreWithNullMethod)).toBe(false);
  });

  it('returns false when headers is not an array', () => {
    const restoreWithInvalidHeaders = JSON.parse(
      JSON.stringify({ ...baseRestore, headers: 'invalid' })
    );

    expect(isRequestState(restoreWithInvalidHeaders)).toBe(false);
  });
});
