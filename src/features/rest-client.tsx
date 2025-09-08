'use client';

import React, { useEffect, useState } from 'react';
import { TextField, Select, MenuItem, Button, Card } from '@mui/material';
import { ROUTES } from '@/sources/routes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { allowedMethods, defaultMethod } from '@/sources/constants';
import { base64Decode } from '@/utils/base64';
import { useTranslations } from 'next-intl';
import { getRawDataFromForm } from '@/utils/getRawDataFromForm';
import { getNewUrl } from '@/utils/getNewUrl';
import { RequestHeaders } from '@/components/request-headers';

type SuccessResponse = {
  status: number;
  ok: boolean;
  json: unknown;
};

type ErrorResponse = {
  error: string;
};

type ApiResponse = SuccessResponse | ErrorResponse | null;

export default function RestClient() {
  const t = useTranslations('RestClientPage');

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [method, setMethod] = useState(defaultMethod);
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [headersCount, setHeadersCount] = useState(0);

  const [response, setResponse] = useState<ApiResponse>(null);

  useEffect(() => {
    async function fetchData(
      url: string,
      method: string,
      body: string,
      headers: Record<string, string>
    ) {
      try {
        const res = await fetch(ROUTES.proxy, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, method, body, headers }),
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
      setUrl(base64Decode(url));
      if (body) {
        setBody(base64Decode(decodeURIComponent(body)));
      }
      const newHeaders: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        newHeaders[key] = value;
      });
      setHeaders(newHeaders);
      setHeadersCount(Object.keys(newHeaders).length);

      void fetchData(base64Decode(url), method, base64Decode(body), newHeaders);
    }
  }, [params, searchParams]);

  async function sendRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { method, url, body, headers } = getRawDataFromForm(formData);

    const newUrl = getNewUrl(method, url, body, headers);
    router.push(newUrl);
  }

  return (
    <form onSubmit={sendRequest} className="p-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <Select
          name="method"
          value={method}
          onChange={e => setMethod(e.target.value)}
        >
          {allowedMethods.map(m => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          value={url}
          onChange={e => setUrl(e.target.value)}
          label="Endpoint URL"
          name="url"
        />
        <Button type="submit" variant="contained">
          {t('button')}
        </Button>
      </div>

      <TextField
        label="Request Body"
        multiline
        minRows={6}
        fullWidth
        name="body"
        value={body}
        onChange={e => setBody(e.target.value)}
      />

      <RequestHeaders
        headers={headers}
        setHeaders={setHeaders}
        headersCount={headersCount}
        setHeadersCount={setHeadersCount}
      />

      {response && (
        <Card className="p-4">
          <div className="overflow-auto max-h-96">
            <SyntaxHighlighter
              language="json"
              style={prism}
              wrapLongLines
              customStyle={{ fontSize: '0.875rem', borderRadius: '0.5rem' }}
            >
              {JSON.stringify(response, null, 2)}
            </SyntaxHighlighter>
          </div>
        </Card>
      )}
    </form>
  );
}
