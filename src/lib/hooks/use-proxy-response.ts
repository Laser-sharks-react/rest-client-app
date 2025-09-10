import { headersArrayToObj } from '@/lib/utils/headers-array-to-obj';
import { ROUTES } from '../constants/routes';
import type { RequestState } from '../types/request';
import { useState } from 'react';
import type { ApiResponse } from '../types/response';

export function useProxyResponse() {
  const [response, setResponse] = useState<ApiResponse>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData({ body, headers, method, url }: RequestState) {
    try {
      setResponse(null);
      setIsLoading(true);
      const headersObj = headersArrayToObj(headers);

      const res = await fetch(ROUTES.proxy, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, body, headers: headersObj }),
      });
      const json = await res.json();
      setResponse({ status: res.status, ok: res.ok, json });
    } catch (e) {
      setResponse(
        e instanceof Error ? { error: e.message } : { error: String(e) }
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { response, isLoading, fetchData };
}
