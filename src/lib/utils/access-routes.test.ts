import { describe, it, expect, afterEach, jest } from '@jest/globals';
import { isProtectedRoute, isPublicRoute } from './access-routes';
import { ROUTES } from '../constants/routes';

describe('access-routes utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('isProtectedRoute: true for protected routes', () => {
    expect(isProtectedRoute(ROUTES.history)).toBe(true);
    expect(isProtectedRoute(ROUTES.request)).toBe(true);
    expect(isProtectedRoute(ROUTES.variables)).toBe(true);
  });

  it('isProtectedRoute: false for public routes', () => {
    expect(isProtectedRoute(ROUTES.login)).toBe(false);
    expect(isProtectedRoute(ROUTES.signup)).toBe(false);
  });

  it('isPublicRoute: true for public routes', () => {
    expect(isPublicRoute(ROUTES.login)).toBe(true);
    expect(isPublicRoute(ROUTES.signup)).toBe(true);
  });

  it('isPublicRoute: false for protected routes', () => {
    expect(isPublicRoute(ROUTES.history)).toBe(false);
    expect(isPublicRoute(ROUTES.request)).toBe(false);
    expect(isPublicRoute(ROUTES.variables)).toBe(false);
  });
});
