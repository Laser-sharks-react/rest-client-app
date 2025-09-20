import type { RequestPayload } from '@/lib/types/request';
import { ROUTES } from '@/lib/constants/routes';
import type { ApiResponse } from '../types/response';

export const fetchProxyRequest = async ({
  method,
  url,
  body,
  headers,
}: RequestPayload): Promise<ApiResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.proxy}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, body, headers }),
      }
    );
    const response: ApiResponse = await res.json();
    return response;
  } catch (e) {
    return {
      status: 500,
      ok: false,
      json: { error: e instanceof Error ? e.message : String(e) },
    };
  }
};
