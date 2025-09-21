import type { HttpHeader, RequestState } from '../../types/request';
import { replaceVariables } from './replace-variables';

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
