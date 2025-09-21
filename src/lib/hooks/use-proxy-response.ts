import { headersArrayToObj } from '@/lib/utils/headers-array-to-obj';
import { useState } from 'react';
import type { ApiResponse } from '../types/response';
import { transformRequestWithVariables } from '../utils/variables/transform-request-with-variables';
import { fetchProxyRequest } from '../utils/fetch-proxy-request';
import type { RequestState } from '../types/request';

export function useProxyResponse() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData(request: RequestState) {
    try {
      setIsLoading(true);

      const { body, headers, method, url } =
        transformRequestWithVariables(request);

      const res = await fetchProxyRequest({
        url,
        method,
        body,
        headers: headersArrayToObj(headers),
      });
      setResponse(res);
    } catch (e) {
      setResponse({ json: { error: String(e) }, status: 400, ok: false });
    } finally {
      setIsLoading(false);
    }
  }

  return { response, isLoading, fetchData, setResponse };
}
