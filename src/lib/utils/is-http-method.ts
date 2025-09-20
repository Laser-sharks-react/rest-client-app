import type { HttpMethod } from '@/lib/types/request';
import { HTTP_METHODS } from '../constants/request';

export function isHttpMethod(value: unknown): value is HttpMethod {
  const HTTP_METHODS_STR: string[] = HTTP_METHODS;
  return (
    typeof value === 'string' && HTTP_METHODS_STR.includes(value.toUpperCase())
  );
}
