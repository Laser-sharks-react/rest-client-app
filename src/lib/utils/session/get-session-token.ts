import { COOKIES } from '@/lib/constants/cookie';
import { cookies } from 'next/headers';

export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(COOKIES.session)?.value || null;
}
