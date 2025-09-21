import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  expect,
  test,
} from '@jest/globals';
import { useVariablesStore } from './variables-store';
import { LS_KEYS } from '@/lib/types/ls-keys';

let rndSpy: jest.SpyInstance<string, []>;
let setItemSpy: jest.SpyInstance;

beforeAll(() => {
  rndSpy = jest.spyOn(global.crypto, 'randomUUID').mockReturnValue('uuid-rest');
  setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
});

afterAll(() => {
  rndSpy.mockRestore();
  setItemSpy.mockRestore();
});

beforeEach(() => {
  rndSpy
    .mockReset()
    .mockReturnValueOnce('uuid-1')
    .mockReturnValueOnce('uuid-2')
    .mockReturnValue('uuid-rest');

  localStorage.clear();
  useVariablesStore.getState().reset();
});

describe('useVariablesStore (Zustand)', () => {
  test('initial state: variables = []', () => {
    expect(useVariablesStore.getState().variables).toEqual([]);
  });

  test('addVariable with no args: creates empty pair key-value and returns id', () => {
    const id = useVariablesStore.getState().addVariable();
    const { variables } = useVariablesStore.getState();

    expect(id).toBe('uuid-1');
    expect(variables).toHaveLength(1);
    expect(variables[0]).toEqual({ id: 'uuid-1', key: '', value: '' });

    expect(setItemSpy).toHaveBeenCalled();
    const [savedKey, savedJson] = setItemSpy.mock.calls.at(-1)!;
    expect(savedKey).toBe(LS_KEYS.variables);
    expect(savedJson).toContain('"variables"');
    expect(savedJson).toContain('"uuid-1"');
  });

  test('addVariable({ key, value }) and updateVariableKey/Value updates record correctly', () => {
    const { addVariable, updateVariableKey, updateVariableValue } =
      useVariablesStore.getState();

    const id = addVariable({
      key: 'URL',
      value: 'https://example.com',
    });
    let state = useVariablesStore.getState();
    expect(id).toBe('uuid-1');
    expect(state.variables[0]).toEqual({
      id: 'uuid-1',
      key: 'URL',
      value: 'https://example.com',
    });

    updateVariableKey({ id, key: 'NEW_URL' });
    updateVariableValue({ id, value: 'https://new-example.com' });

    state = useVariablesStore.getState();
    expect(state.variables[0]).toEqual({
      id: 'uuid-1',
      key: 'NEW_URL',
      value: 'https://new-example.com',
    });
  });

  test('removeVariable deletes by id and ignores not existing', () => {
    const { addVariable, removeVariable } = useVariablesStore.getState();
    const id1 = addVariable({ key: 'keyTest1', value: 'valueTest1' });
    const id2 = addVariable({ key: 'keyTest2', value: 'valueTest2' });
    expect(useVariablesStore.getState().variables).toHaveLength(2);

    removeVariable(id1);
    expect(useVariablesStore.getState().variables).toHaveLength(1);
    expect(useVariablesStore.getState().variables[0].id).toBe(id2);

    removeVariable('missing');
    expect(useVariablesStore.getState().variables).toHaveLength(1);
  });

  test('reset clears only variables', () => {
    const { addVariable, reset } = useVariablesStore.getState();
    addVariable({ key: 'keyTest', value: 'valueTest' });
    expect(useVariablesStore.getState().variables).toHaveLength(1);

    reset();
    expect(useVariablesStore.getState().variables).toEqual([]);
  });
});
