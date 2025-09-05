'use client';

import { useState } from 'react';
import { TextField, Select, MenuItem, Button, Card } from '@mui/material';
import { ROUTES } from '@/sources/routes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('{}');
  const [response, setResponse] = useState<ApiResponse>(null);

  async function sendRequest() {
    try {
      const res = await fetch(ROUTES.proxy, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, body }),
      });
      const json = await res.json();
      setResponse({ status: res.status, ok: res.ok, json });
    } catch (e) {
      setResponse(
        e instanceof Error ? { error: e.message } : { error: String(e) }
      );
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <Select value={method} onChange={e => setMethod(e.target.value)}>
          {['GET', 'POST', 'PUT', 'DELETE'].map(method => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          label="Endpoint URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button variant="contained" onClick={sendRequest}>
          Send
        </Button>
      </div>

      <TextField
        label="Request Body"
        multiline
        minRows={6}
        fullWidth
        value={body}
        onChange={e => setBody(e.target.value)}
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
    </div>
  );
}
