import { ACCESS_ROUTES } from '@/lib/constants/routes';

export function isProtectedRoute(pathnameNoLocale: string): boolean {
  return ACCESS_ROUTES.protected.includes(pathnameNoLocale);
}

export function isPublicRoute(pathnameNoLocale: string): boolean {
  return ACCESS_ROUTES.public.includes(pathnameNoLocale);
}
