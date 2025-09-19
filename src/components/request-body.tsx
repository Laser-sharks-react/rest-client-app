'use client';

import { useRequestStore } from '@/store/request-store';
import { base64Decode } from '@/lib/utils/base64';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import JsonEditor from './json-editor';
import { Card, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export function RequestBody() {
  const params = useParams();
  const t = useTranslations('RequestBody');
  const [_method, _url, bodyParam] = params.params ?? [];

  const { body, method, setBody } = useRequestStore();

  useEffect(() => {
    if (bodyParam) setBody(base64Decode(decodeURIComponent(bodyParam)));
  }, [bodyParam, setBody]);

  if (method === 'GET') return null;
  return (
    <Card sx={{ p: 2, gap: 2 }}>
      <Typography variant="h5" mb={2}>
        {t('body')}
      </Typography>
      <JsonEditor initial={body} onValidChange={setBody} />
    </Card>
  );
}
