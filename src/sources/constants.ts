import { type HttpMethod } from './types';

export const HTTP_METHODS: HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
] as const;

export const DEFAULT_HTTP_METHOD: HttpMethod = 'GET';
