'use client';

import { useRequestStore } from '@/store/request-store';
import { base64Decode } from '@/lib/utils/base64';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import JsonEditor from './json-editor';
import { Typography } from '@mui/material';

export function RequestBody() {
  const params = useParams();
  const [_method, _url, bodyParam] = params.params ?? [];

  const { body, method, setBody } = useRequestStore();

  useEffect(() => {
    if (bodyParam) setBody(base64Decode(decodeURIComponent(bodyParam)));
  }, [bodyParam, setBody]);

  if (method === 'GET') return null;
  return (
    <>
      <Typography variant="h6">Body</Typography>
      <JsonEditor initial={body} onValidChange={setBody} />
    </>
  );
}
