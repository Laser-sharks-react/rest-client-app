import { base64Encode } from '@/lib/utils/base64';
import { parseUrlToRequestPayload } from '@/lib/utils/parse-url-to-requset-payload';

const createParamsPromise = (values?: string[]) =>
  Promise.resolve({ params: values });

const createSearchParamsPromise = (
  entries: Record<string, string | string[] | undefined>
) => Promise.resolve(entries);

describe('parseUrlToRequestPayload', () => {
  it('returns defaults when params missing', async () => {
    const payload = await parseUrlToRequestPayload({
      params: createParamsPromise(),
      searchParams: createSearchParamsPromise({}),
    });

    expect(payload).toEqual({
      method: 'GET',
      url: '',
      body: '',
      headers: {},
    });
  });

  it('decodes method, url, body and headers', async () => {
    const encodedUrl = encodeURIComponent(
      base64Encode('https://api.test/users')
    );
    const encodedBody = encodeURIComponent(base64Encode('{"foo":"bar"}'));

    const payload = await parseUrlToRequestPayload({
      params: createParamsPromise(['POST', encodedUrl, encodedBody]),
      searchParams: createSearchParamsPromise({
        Accept: ['application/json', 'text/plain'],
        Authorization: 'Bearer token',
      }),
    });

    expect(payload).toEqual({
      method: 'POST',
      url: 'https://api.test/users',
      body: '{"foo":"bar"}',
      headers: {
        Accept: 'application/json, text/plain',
        Authorization: 'Bearer token',
      },
    });
  });

  it('falls back to default method when invalid', async () => {
    const encodedUrl = encodeURIComponent(
      base64Encode('https://api.test/check')
    );

    const payload = await parseUrlToRequestPayload({
      params: createParamsPromise(['INVALID', encodedUrl]),
      searchParams: createSearchParamsPromise({}),
    });

    expect(payload.method).toBe('GET');
    expect(payload.url).toBe('https://api.test/check');
  });
});
