import { describe, it, expect, jest, afterEach } from '@jest/globals';

import type { RequestState } from '@/lib/types/request';
import { DICTIONARY_MOCK, ID_VAR, TOKEN_VAR, USER_VAR } from '@/__mocks__';

const getVarsMock = jest.fn(() => DICTIONARY_MOCK);

jest.unstable_mockModule('./get-variables-from-ls', () => ({
  getVariablesFromLS: getVarsMock,
}));

const { transformRequestWithVariables } = await import(
  './transform-request-with-variables'
);
const { getVariablesFromLS } = await import('./get-variables-from-ls');

describe('transformRequestWithVariables', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const input: RequestState = {
    url: `https://api.com/{{${ID_VAR.key}}}`,
    body: `{"token":"{{${TOKEN_VAR.key}}}"}`,
    method: 'POST',
    headers: [
      { id: 'h1', key: 'Authorization', value: `Bearer {{${TOKEN_VAR.key}}}` },
      { id: 'h2', key: 'X-User', value: `{{${USER_VAR.key}}}` },
    ],
  };
  const output = {
    url: `https://api.com/${ID_VAR.value}`,
    body: `{"token":"${TOKEN_VAR.value}"}`,
    method: 'POST',
    headers: [
      { id: 'h1', key: 'Authorization', value: `Bearer ${TOKEN_VAR.value}` },
      { id: 'h2', key: 'X-User', value: `${USER_VAR.value}` },
    ],
  };

  it('заменяет переменные в url, body и в каждом header.key/value, сохраняет id и method', () => {
    const out = transformRequestWithVariables(input);

    expect(out).toEqual(output);

    expect(getVariablesFromLS).toHaveBeenCalledTimes(6);
  });

  it('не мутирует исходный объект', () => {
    const snapshot = JSON.parse(JSON.stringify(input));
    void transformRequestWithVariables(input);

    expect(input).toEqual(snapshot);
  });
});
