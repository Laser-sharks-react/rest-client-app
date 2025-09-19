import { headersArrayToObj } from '@/lib/utils/headers-array-to-obj';
import type { RequestState } from '../types/request';
import { useState } from 'react';
import type { ApiResponse } from '../types/response';
import { fetchProxyRequest } from '../utils/fetch-proxy-request';

export function useProxyResponse() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData({ body, headers, method, url }: RequestState) {
    try {
      setResponse(null);
      setIsLoading(true);

      const headersObj = headersArrayToObj(headers);
      const res = await fetchProxyRequest({
        url,
        method,
        body,
        headers: headersObj,
      });
      setResponse(res);
    } catch (e) {
      setResponse({ json: String(e), status: 400, ok: false });
    } finally {
      setIsLoading(false);
    }
  }

  return { response, isLoading, fetchData, setResponse };
}
