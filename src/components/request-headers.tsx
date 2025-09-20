'use client';

import { Card, IconButton, TextField, Typography } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRequestStore } from '@/store/request-store';
import { useTranslations } from 'next-intl';

export const RequestHeaders = () => {
  const searchParams = useSearchParams();
  const t = useTranslations('RequestHeaders');
  const {
    headers,
    addHeader,
    removeHeader,
    updateHeaderKey,
    updateHeaderValue,
    clearHeaders,
  } = useRequestStore();

  useEffect(() => {
    const hasParams = searchParams.toString() !== '';
    if (!hasParams) return;

    clearHeaders();

    searchParams.forEach((value, key) => {
      addHeader({ key, value });
    });
  }, [addHeader, clearHeaders, searchParams]);

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div className="flex justify-between items-center">
        <Typography variant="h5">{t('headers')}</Typography>
        <IconButton onClick={() => addHeader()}>
          <AddIcon />
        </IconButton>
      </div>

      {headers.map(({ id, key, value }) => (
        <div key={id} className="flex gap-2 items-center">
          <TextField
            label="Key"
            name="Key"
            value={key}
            onChange={e => updateHeaderKey({ id, key: e.target.value })}
          />
          <TextField
            label="Value"
            value={value}
            name="Value"
            onChange={e => updateHeaderValue({ id, value: e.target.value })}
          />
          <IconButton onClick={() => removeHeader(id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </Card>
  );
};
