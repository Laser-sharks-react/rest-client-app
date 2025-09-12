import { jwtVerify } from 'jose';
import { ALG } from '@/lib/constants';
import { getSessionSecret, getSessionToken } from './session-token';

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
