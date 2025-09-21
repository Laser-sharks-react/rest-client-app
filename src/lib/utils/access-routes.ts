import { ACCESS_ROUTES } from '@/lib/constants/routes';

export function isProtectedRoute(pathnameNoLocale: string): boolean {
  return ACCESS_ROUTES.protected.some(route =>
    pathnameNoLocale.startsWith(route)
  );
}

export function isPublicRoute(pathnameNoLocale: string): boolean {
  return ACCESS_ROUTES.public.some(route => pathnameNoLocale.startsWith(route));
}
