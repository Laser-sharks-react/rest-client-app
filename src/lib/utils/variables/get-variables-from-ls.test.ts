import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { getVariablesFromLS } from './get-variables-from-ls';
import { LS_KEYS } from '@/lib/types/ls-keys';

describe('getVariablesFromLS', () => {
  const spyGetItem = () => jest.spyOn(Storage.prototype, 'getItem');

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('Returns an array of variables when JSON is valid.', () => {
    const data = {
      state: { variables: [{ key: 'TOKEN', id: '123', value: 'abc' }] },
    };
    const getItem = spyGetItem().mockReturnValue(JSON.stringify(data));

    const result = getVariablesFromLS();

    expect(getItem).toHaveBeenCalledWith(LS_KEYS.variables);
    expect(result).toEqual(data.state.variables);
  });

  it('Return [] if key is null.', () => {
    spyGetItem().mockReturnValue(null);
    expect(getVariablesFromLS()).toEqual([]);
  });

  it('Return [] if the value is an empty string.', () => {
    spyGetItem().mockReturnValue('');
    expect(getVariablesFromLS()).toEqual([]);
  });

  it('Return [] if JSON broken.', () => {
    spyGetItem().mockReturnValue('not a json');
    expect(getVariablesFromLS()).toEqual([]);
  });

  it('Return an array with an incorrect schema (no state/variables).', () => {
    spyGetItem().mockReturnValue(JSON.stringify({ foo: 'bar' }));
    expect(getVariablesFromLS()).toEqual([]);
  });

  it('Return an empty array if the variables are empty.', () => {
    const data = { state: { variables: [] } };
    spyGetItem().mockReturnValue(JSON.stringify(data));
    expect(getVariablesFromLS()).toEqual([]);
  });
});
