import type { HttpMethod, Language } from '../types/request';

export const HTTP_METHODS: HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
];

export const DEFAULT_HTTP_METHOD: HttpMethod = 'GET';

export const LANGUAGES: Language[] = [
  'cURL',
  'JavaScript Fetch',
  'JavaScript XHR',
  'NodeJS',
  'Python',
  'Java',
  'C#',
  'Go',
];
