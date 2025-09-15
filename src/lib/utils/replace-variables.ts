import type { HttpHeader, RequestState } from '../types/request';
import { getVariablesFromLS } from './get-variables-from-ls';

export const VARIABLE_REGEX = /\{\{\s*([_\p{L}][\p{L}\p{N}_-]*)\s*\}\}/gu;

export function transformRequestWithVariables({
  url,
  body,
  headers,
  method,
}: RequestState) {
  const replacedUrl = replaceVariables(url);
  const replacedBody = replaceVariables(body);
  const replacedHeaders: HttpHeader[] = headers.map(head => ({
    id: head.id,
    key: replaceVariables(head.key),
    value: replaceVariables(head.value),
  }));

  return {
    body: replacedBody,
    headers: replacedHeaders,
    url: replacedUrl,
    method,
  };
}

type VariableMatch = {
  name: string;
  start: number;
  end: number;
  raw: string;
};

function replaceVariables(input: string) {
  let res = input;

  const matches = findVariables(input);
  const dictionary = getVariablesFromLS();

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
