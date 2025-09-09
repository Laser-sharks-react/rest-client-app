'use client';

import React, { useEffect, useState } from 'react';
import { ROUTES } from '@/sources/routes';
import { useRouter } from 'next/navigation';
import { getNewUrl } from '@/utils/getNewUrl';
import { RequestHeaders } from '@/components/request-headers';
import { CustomResponse } from '@/components/custom-response';
import { RequestSender } from '@/components/request-sender';
import { headersArrayToObj } from '@/utils/headersArrayToObj';
import { RequestBody } from '@/components/request-body';
import { useRequestStore } from '@/store/request-store';
import type { HttpHeader, ApiResponse, HttpMethod } from '@/sources/types';

export default function RequestPage() {
  const router = useRouter();
  const { body, method, url, headers } = useRequestStore();

  const [response, setResponse] = useState<ApiResponse>(null);

  async function fetchData(
    url: string,
    method: HttpMethod,
    body: string,
    headers: HttpHeader[]
  ) {
    try {
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
    }
  }

  useEffect(() => {
    if (url) void fetchData(url, method, body, headers);
  }, []);

  async function sendRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newUrl = getNewUrl(method, url, body, headers);
    router.push(`${ROUTES.rest}${newUrl}`);

    await fetchData(url, method, body, headers);
  }

  return (
    <form
      onSubmit={sendRequest}
      className="p-4 flex flex-col gap-4 min-h-[600px]"
    >
      <RequestSender />
      <RequestBody />
      <RequestHeaders />

      <div className="min-h-[200px]">
        {response && <CustomResponse response={response} />}
      </div>
    </form>
  );
}
