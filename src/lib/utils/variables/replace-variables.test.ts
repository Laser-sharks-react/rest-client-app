import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { replaceVariables } from './replace-variables';
import { DICTIONARY_MOCK, ID_VAR, TOKEN_VAR, USER_VAR } from '@/__mocks__';

describe('replaceVariables', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Replaces one variable.', () => {
    const input = `Bearer {{${TOKEN_VAR.key}}}`;
    const out = replaceVariables(input, DICTIONARY_MOCK);
    expect(out).toBe(`Bearer ${TOKEN_VAR.value}`);
  });

  it('Replaces several different variables.', () => {
    const input = `id={{${ID_VAR.key}}}&user={{${USER_VAR.key}}}`;
    const out = replaceVariables(input, DICTIONARY_MOCK);
    expect(out).toBe(`id=${ID_VAR.value}&user=${USER_VAR.value}`);
  });

  it('Replaces repeated occurrences of a single variable.', () => {
    const input = `v={{${ID_VAR.key}}};{{${ID_VAR.key}}};{{${ID_VAR.key}}}`;
    const out = replaceVariables(input, DICTIONARY_MOCK);
    expect(out).toBe(`v=${ID_VAR.value};${ID_VAR.value};${ID_VAR.value}`);
  });

  it('Leaves untouched variables that are not in the dictionary.', () => {
    const input = `x={{UNKNOWN}}&y={{${ID_VAR.key}}}`;
    const out = replaceVariables(input, DICTIONARY_MOCK);
    expect(out).toBe(`x={{UNKNOWN}}&y=${ID_VAR.value}`);
  });

  it('Returns the original string if there are no variables.', () => {
    const input = 'no variables here';
    const out = replaceVariables(input, DICTIONARY_MOCK);
    expect(out).toBe(input);
  });

  it('Works correctly with text before/after variables and special characters.', () => {
    const input = `@::{{${USER_VAR.key}}}::`;
    const out = replaceVariables(input, DICTIONARY_MOCK);
    expect(out).toBe(`@::${USER_VAR.value}::`);
  });
});
