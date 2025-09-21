jest.mock('@/lib/utils/variables/replace-variables', () => ({
  replaceVariables: jest.fn((value: string) => `replaced:${value}`),
}));

import { transformRequestWithVariables } from '@/lib/utils/variables/transform-request-with-variables';
import { replaceVariables } from '@/lib/utils/variables/replace-variables';
import type { RequestState } from '@/lib/types/request';

const mockedReplaceVariables = jest.mocked(replaceVariables);

const baseRequest: RequestState = {
  url: 'https://api.test/{{url}}',
  method: 'PATCH',
  body: '{"name":"{{user}}"}',
  headers: [
    { id: '1', key: 'X-User', value: '{{user}}' },
    { id: '2', key: 'X-Token', value: '{{token}}' },
  ],
};

beforeEach(() => {
  mockedReplaceVariables.mockClear();
  mockedReplaceVariables.mockImplementation(value => `replaced:${value}`);
});

describe('transformRequestWithVariables', () => {
  it('replaces variables in url, body, and headers', () => {
    const result = transformRequestWithVariables(baseRequest);

    expect(result).toEqual({
      method: 'PATCH',
      url: 'replaced:https://api.test/{{url}}',
      body: 'replaced:{"name":"{{user}}"}',
      headers: [
        { id: '1', key: 'replaced:X-User', value: 'replaced:{{user}}' },
        { id: '2', key: 'replaced:X-Token', value: 'replaced:{{token}}' },
      ],
    });
  });

  it('passes each field to replaceVariables in order', () => {
    transformRequestWithVariables(baseRequest);

    expect(mockedReplaceVariables).toHaveBeenCalledWith(
      'https://api.test/{{url}}'
    );
    expect(mockedReplaceVariables).toHaveBeenCalledWith('{"name":"{{user}}"}');
    expect(mockedReplaceVariables).toHaveBeenCalledWith('X-User');
    expect(mockedReplaceVariables).toHaveBeenCalledWith('{{user}}');
    expect(mockedReplaceVariables).toHaveBeenCalledWith('X-Token');
    expect(mockedReplaceVariables).toHaveBeenCalledWith('{{token}}');
    expect(mockedReplaceVariables).toHaveBeenCalledTimes(6);
  });

  it('does not mutate original request headers', () => {
    const originalHeaders = baseRequest.headers.map(header => ({ ...header }));

    transformRequestWithVariables(baseRequest);

    expect(baseRequest.headers).toEqual(originalHeaders);
  });
});
