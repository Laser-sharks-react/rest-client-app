import { jwtVerify } from 'jose';
import { ALG } from '@/lib/constants/cookie';
import { getSessionSecret } from './get-session-secret';
import { getSessionToken } from './get-session-token';

export async function getUserId(): Promise<string | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: [ALG],
    });
    const userId = payload.userId;
    const isValidUserId = typeof userId === 'string' && userId.length > 0;
    return isValidUserId ? userId : null;
  } catch {
    return null;
  }
}
