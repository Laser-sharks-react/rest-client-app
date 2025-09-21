import { getNewUrl } from '@/lib/utils/get-new-url';
import type { RequestState } from '@/lib/types/request';

const baseState: RequestState = {
  method: 'GET',
  url: 'https://example.com/api',
  body: '',
  headers: [],
};

const createState = (overrides: Partial<RequestState> = {}): RequestState => ({
  ...baseState,
  ...overrides,
});

describe('getNewUrl', () => {
  it('builds url for GET without body segment', () => {
    const state = createState({
      headers: [{ id: '1', key: 'Authorization', value: 'Bearer token' }],
    });

    const result = getNewUrl(state);

    const encodedUrl = encodeURIComponent(
      Buffer.from(state.url).toString('base64')
    );
    const expected = '/GET/' + encodedUrl + '?Authorization=Bearer+token';
    expect(result).toBe(expected);
  });

  it('includes encoded body for non-GET methods', () => {
    const state = createState({
      method: 'POST',
      body: '  {"foo":"bar"}  ',
    });

    const result = getNewUrl(state);

    const encodedUrl = encodeURIComponent(
      Buffer.from(state.url).toString('base64')
    );
    const encodedBody = encodeURIComponent(
      Buffer.from('{"foo":"bar"}').toString('base64')
    );
    const expected = '/POST/' + encodedUrl + '/' + encodedBody;
    expect(result).toBe(expected);
  });

  it('ignores headers with empty keys and empty bodies', () => {
    const state = createState({
      method: 'DELETE',
      body: '   ',
      headers: [
        { id: '1', key: '', value: 'ignored' },
        { id: '2', key: 'Accept', value: 'application/json' },
      ],
    });

    const result = getNewUrl(state);

    const encodedUrl = encodeURIComponent(
      Buffer.from(state.url).toString('base64')
    );
    const expected = '/DELETE/' + encodedUrl + '?Accept=application%2Fjson';
    expect(result).toBe(expected);
  });
});
