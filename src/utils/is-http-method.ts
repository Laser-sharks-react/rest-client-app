import type { HttpMethod } from '@/lib/types';

export function isHttpMethod(value: unknown): value is HttpMethod {
  return (
    typeof value === 'string' &&
    (value === 'GET' ||
      value === 'POST' ||
      value === 'PUT' ||
      value === 'PATCH' ||
      value === 'DELETE')
  );
}
