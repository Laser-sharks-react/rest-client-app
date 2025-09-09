'use client';

import { useRequestStore } from '@/store/request-store';
import { base64Decode } from '@/utils/base64';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import JsonEditor from './json-editor';
import { CircularProgress, Typography } from '@mui/material';

export function RequestBody() {
  const params = useParams();
  const [method, url, bodyParam] = params.params ?? [];

  const { body, setBody } = useRequestStore();

  useEffect(() => {
    if (bodyParam) setBody(base64Decode(decodeURIComponent(bodyParam)));
  }, []);
  if (!body) return <CircularProgress />;
  return (
    <>
      <Typography variant="h6">Body</Typography>
      <JsonEditor initial={body} onValidChange={setBody} />
    </>
  );
}
