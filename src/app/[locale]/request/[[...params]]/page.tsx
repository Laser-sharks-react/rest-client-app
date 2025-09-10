'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getNewUrl } from '@/utils/get-new-url';
import { RequestHeaders } from '@/components/request-headers';
import { CustomResponse } from '@/components/custom-response';
import { RequestSender } from '@/components/request-sender';
import { headersArrayToObj } from '@/utils/headers-array-to-obj';
import { RequestBody } from '@/components/request-body';
import { useRequestStore } from '@/store/request-store';
import { GeneratedCodeSection } from '@/components/generated-code-section';
import { ROUTES } from '@/lib/constants/routes';
import type { HttpHeader, HttpMethod } from '@/lib/types/request';
import type { ApiResponse } from '@/lib/types/response';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import LoadingScreen from '@/components/loading-screen';
import { CircularProgress, Container, Paper, Stack } from '@mui/material';

export default function RequestPage() {
  const router = useRouter();
  const { body, method, url, headers } = useRequestStore();
  const [_user, isLoading] = useAuthState(auth);
  const [response, setResponse] = useState<ApiResponse>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  async function fetchData(
    url: string,
    method: HttpMethod,
    body: string,
    headers: HttpHeader[]
  ) {
    try {
      setResponse(null);
      setIsLoadingResponse(true);
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
      setIsLoadingResponse(false);
    }
  }

  useEffect(() => {
    if (url) void fetchData(url, method, body, headers);
  }, []);

  async function sendRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newUrl = getNewUrl(method, url, body, headers);
    router.push(`${ROUTES.request}${newUrl}`);

    await fetchData(url, method, body, headers);
  }

  if (isLoading) return <LoadingScreen />;
  return (
    <Container sx={{ p: 3 }}>
      <form onSubmit={sendRequest}>
        <Stack spacing={2}>
          <RequestSender />
          <RequestBody />
          <RequestHeaders />
          <GeneratedCodeSection />
          <div className="min-h-[200px]">
            {response && <CustomResponse response={response} />}
            {isLoadingResponse && <CircularProgress />}
          </div>
        </Stack>
      </form>
    </Container>
  );
}
