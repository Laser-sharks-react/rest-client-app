'use client';

import { useRequestStore } from '@/store/request-store';
import { base64Decode } from '@/utils/base64';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import JsonEditor from './json-editor';
import { CircularProgress, Typography } from '@mui/material';

export function RequestBody() {
  const params = useParams();
  const [_method, url, bodyParam] = params.params ?? [];

  const { body, method, setBody } = useRequestStore();

  useEffect(() => {
    if (bodyParam) setBody(base64Decode(decodeURIComponent(bodyParam)));
  }, []);

  if (method === 'GET') return null;
  return (
    <>
      <Typography variant="h6">Body</Typography>
      <JsonEditor initial={body} onValidChange={setBody} />
    </>
  );
}
