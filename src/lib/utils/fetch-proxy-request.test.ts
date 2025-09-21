import type { ApiResponse } from '@/lib/types/response';

import { fetchProxyRequest } from '@/lib/utils/fetch-proxy-request';
import type { RequestPayload } from '../types/request';

const OLD_ENV = { ...process.env };

describe('fetchProxyRequest (Jest)', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
  });

  afterEach(() => {
    Object.assign(process.env, OLD_ENV);
  });

  it('шлёт POST на правильный URL с корректным телом и заголовками и возвращает payload', async () => {
    const mockApiResponse: ApiResponse = {
      status: 200,
      ok: true,
      json: { hello: 'world' },
    };

    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockApiResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const payload: RequestPayload = {
      method: 'GET',
      url: 'https://api.service.dev/users',
      body: `{ "q": "john" }`,
      headers: { Authorization: 'Bearer token' },
    };

    const res = await fetchProxyRequest(payload);

    expect(res).toEqual(mockApiResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [calledUrl, calledInit] = fetchMock.mock.calls[0] ?? [];

    expect(calledUrl).toBe('https://example.com/api/proxy');
    expect(calledInit?.method).toBe('POST');
    expect(calledInit?.headers).toEqual({
      'Content-Type': 'application/json',
    });

    const sentBody = JSON.parse(String(calledInit?.body));
    expect(sentBody).toEqual({
      url: payload.url,
      method: payload.method,
      body: payload.body,
      headers: payload.headers,
    });
  });

  it('возвращает объект ошибки при исключении (Error)', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network fail'));

    const res = await fetchProxyRequest({
      method: 'POST',
      url: 'https://api.example.com',
      body: '',
      headers: {},
    });

    if (res.ok) {
      throw new Error('Expected an error response');
    }
    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
    expect(res.json.error).toContain('Network fail');
  });

  it('возвращает объект ошибки при исключении (не Error)', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue('oops');

    const res = await fetchProxyRequest({
      method: 'DELETE',
      url: 'https://api.example.com/x',
      body: '',
      headers: { 'X-Test': '1' },
    });

    if (res.ok) {
      throw new Error('Expected an error response');
    }

    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
    expect(res.json.error).toBe('oops');
  });
});
