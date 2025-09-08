import { ROUTES } from '@/lib/constants';

export type AccessRoutes = {
  protected: string[];
  public: string[];
};

const routes: AccessRoutes = {
  protected: [ROUTES.history],
  public: [ROUTES.login, ROUTES.signup],
};

export function isProtectedRoute(pathnameNoLocale: string): boolean {
  return routes.protected.includes(pathnameNoLocale);
}

export function isPublicRoute(pathnameNoLocale: string): boolean {
  return routes.public.includes(pathnameNoLocale);
}
