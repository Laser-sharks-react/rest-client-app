'use client';

import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { ROUTES } from '@/sources/routes';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { allowedMethods, defaultMethod } from '@/sources/constants';
import { base64Decode } from '@/utils/base64';
import { getRawDataFromForm } from '@/utils/getRawDataFromForm';
import { getNewUrl } from '@/utils/getNewUrl';
import type { Header } from '@/components/request-headers';
import { RequestHeaders } from '@/components/request-headers';
import { CustomResponse } from '@/components/custom-response';
import { RequestSender } from '@/components/request-sender';
import { headersArrayToObj } from '@/utils/headersArrayToObj';

type SuccessResponse = {
  status: number;
  ok: boolean;
  json: unknown;
};

type ErrorResponse = {
  error: string;
};

export type ApiResponse = SuccessResponse | ErrorResponse | null;

export default function RestClient() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [method, setMethod] = useState(defaultMethod);
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Header[]>([]);

  const [response, setResponse] = useState<ApiResponse>(null);

  useEffect(() => {
    async function fetchData(
      url: string,
      method: string,
      body: string,
      headers: Header[]
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

    const [method, url, body] = params?.params ?? [];

    if (method && allowedMethods.includes(method) && url) {
      setMethod(method);
      setUrl(base64Decode(decodeURIComponent(url)));

      if (body) {
        setBody(base64Decode(decodeURIComponent(body)));
      }

      const newHeaders: Header[] = [];
      searchParams.forEach((value, key) => {
        newHeaders.push({ id: crypto.randomUUID(), key, value });
      });
      setHeaders(newHeaders);

      void fetchData(
        base64Decode(url),
        method,
        body ? base64Decode(body) : '',
        newHeaders
      );
    }
  }, [params, searchParams]);

  async function sendRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { method, url, body, headers } = getRawDataFromForm(formData);

    const headersObj = headersArrayToObj(headers);

    const newUrl = getNewUrl(method, url, body, headersObj);
    router.push(newUrl);
  }

  return (
    <form
      onSubmit={sendRequest}
      className="p-4 flex flex-col gap-4 min-h-[600px]"
    >
      <RequestSender
        method={method}
        setMethod={setMethod}
        url={url}
        setUrl={setUrl}
      />

      <TextField
        label="Request Body"
        multiline
        minRows={6}
        fullWidth
        name="body"
        value={body}
        onChange={e => setBody(e.target.value)}
      />

      <RequestHeaders headers={headers} setHeaders={setHeaders} />

      <div className="min-h-[200px]">
        {response ? (
          <CustomResponse response={response} />
        ) : (
          <span className="text-gray-400">Loading...</span>
        )}
      </div>
    </form>
  );
}
