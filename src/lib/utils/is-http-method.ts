import type { HttpMethod } from '@/lib/types/request';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export function isHttpMethod(value: unknown): value is HttpMethod {
  return (
    typeof value === 'string' && ALLOWED_METHODS.includes(value.toUpperCase())
  );
}
