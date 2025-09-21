import { createRequestRecord } from '@/lib/utils/create-request-record';
import { DEFAULT_HTTP_METHOD } from '@/lib/constants/request';

describe('createRequestRecord', () => {
  it('builds record from valid data', () => {
    const record = createRequestRecord(
      {
        id: 'rec-1',
        uid: 'user-1',
        endpoint: '/users',
        method: 'POST',
        status: 201,
        latencyMs: 42,
        reqBytes: 512,
        resBytes: 1024,
        error: null,
        time: 123456789,
        restore: {
          url: 'https://api.test/users',
          method: 'PATCH',
          headers: [{ id: 'h1', key: 'Accept', value: 'application/json' }],
          body: '{"name":"john"}',
        },
      },
      'fallback-uid'
    );

    expect(record).toEqual({
      id: 'rec-1',
      uid: 'user-1',
      endpoint: '/users',
      method: 'POST',
      status: 201,
      latencyMs: 42,
      reqBytes: 512,
      resBytes: 1024,
      error: null,
      time: 123456789,
      restore: {
        url: 'https://api.test/users',
        method: 'PATCH',
        headers: [{ id: 'h1', key: 'Accept', value: 'application/json' }],
        body: '{"name":"john"}',
      },
    });
  });

  it('applies fallbacks for missing fields', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(987654321);

    const record = createRequestRecord(
      {
        uid: null,
        reqBytes: 'invalid',
        resBytes: Number.NaN,
        time: 'not-a-number',
        method: 'UNKNOWN',
        status: 'bad',
        restore: {
          method: 'BAD',
          headers: 'oops',
          body: null,
        },
      },
      'fallback-uid'
    );

    expect(record).toEqual({
      id: '',
      uid: 'fallback-uid',
      endpoint: '',
      method: null,
      status: null,
      latencyMs: null,
      reqBytes: 0,
      resBytes: 0,
      error: null,
      time: 987654321,
      restore: {
        url: '',
        method: DEFAULT_HTTP_METHOD,
        headers: [],
        body: '',
      },
    });

    nowSpy.mockRestore();
  });
});
