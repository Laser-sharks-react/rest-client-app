import type { AccessRoutes } from '../types/types';

export const ROUTES = {
  signup: '/signup',
  proxy: '/api/proxy',
  session: '/api/session',
  home: '/',
  login: '/login',
  history: '/history',
  request: '/request',
  variables: '/variables',
};

export const ACCESS_ROUTES: AccessRoutes = {
  protected: [ROUTES.history, ROUTES.request, ROUTES.variables],
  public: [ROUTES.login, ROUTES.signup],
};
