import { VARIABLE_REGEX } from '../../constants/validation';
import type { VariableMatch } from '../../types/variable';
import { getVariablesFromLS } from './get-variables-from-ls';

export function replaceVariables(
  input: string,
  dictionary = getVariablesFromLS()
) {
  let res = input;

  const matches = findVariables(input);
  matches.forEach(match => {
    const inDictionary = dictionary.find(dict => dict.key === match.name);
    if (inDictionary) {
      res = res.replace(match.raw, inDictionary.value);
    }
  });

  return res;
}

function findVariables(input: string) {
  const result: VariableMatch[] = [];

  for (const match of input.matchAll(VARIABLE_REGEX)) {
    const start = match.index;
    if (start === null) continue;

    const [raw, name] = match;
    result.push({ name, raw, start, end: start + raw.length });
  }
  return result;
}
