import { headersArrayToObj } from '@/lib/utils/headers-array-to-obj';

import { ROUTES } from '../constants/routes';
import type { RequestState } from '../types/request';
import { useState } from 'react';
import type { ApiResponse } from '../types/response';
import { transformRequestWithVariables } from '../utils/variables/transform-request-with-variables';

export function useProxyResponse() {
  const [response, setResponse] = useState<ApiResponse>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData(request: RequestState) {
    try {
      setResponse(null);
      setIsLoading(true);

      const { body, headers, method, url } =
        transformRequestWithVariables(request);

      const res = await fetch(ROUTES.proxy, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url,
          body,
          headers: headersArrayToObj(headers),
        }),
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
