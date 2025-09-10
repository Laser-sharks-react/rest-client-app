import type { Language, HttpMethod } from './types';

export const ROUTES = {
  signup: '/signup',
  proxy: '/api/proxy',
  session: '/api/session',
  home: '/',
  login: '/login',
  history: '/history',
  rest: '/rest',
};

export const COOKIES = {
  session: 'session',
};

export const ALG = 'HS256';
export const COOKIE_TIME = 60 * 60 * 24 * 7;

export const EMAIL_REGEX =
  /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)+([a-z]{2,18})$/i;

export const PASSWORD_REGEX =
  /^(?=.*\p{L})(?=.*\p{N})(?=.*[^\p{L}\p{N}\s]).{8,}$/u;

export const HTTP_METHODS: HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
] as const;

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
