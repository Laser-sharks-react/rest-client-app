import { HTTP_METHODS } from '../constants/request';
import type { HttpMethod } from '../types/request';

export function isMethod(value: unknown): value is HttpMethod {
  if (typeof value !== 'string') return false;
  for (const method of HTTP_METHODS) {
    if (method === value) return true;
  }
  return false;
}
