import { ROUTES } from '@/sources/routes';

export type AccessPatterns = {
  protected: string[];
  public: string[];
};

export function buildAccessPatterns(): AccessPatterns {
  return {
    protected: [ROUTES.history],
    public: [ROUTES.login, ROUTES.signup],
  };
}

export function isProtectedPath(
  pathnameNoLocale: string,
  patterns: AccessPatterns
): boolean {
  return patterns.protected.includes(pathnameNoLocale);
}

export function isPublicPath(
  pathnameNoLocale: string,
  patterns: AccessPatterns
): boolean {
  return patterns.public.includes(pathnameNoLocale);
}
