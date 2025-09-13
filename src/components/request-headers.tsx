'use client';

import { Card, IconButton, TextField } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRequestStore } from '@/store/request-store';

export const RequestHeaders = () => {
  const searchParams = useSearchParams();
  const { headers, addHeader, removeHeader, updateHeader, clearHeaders } =
    useRequestStore();

  useEffect(() => {
    const hasParams = searchParams.toString() !== '';
    if (!hasParams) return;

    clearHeaders();

    searchParams.forEach((value, key) => {
      addHeader({ key, value });
    });
  }, [addHeader, clearHeaders, searchParams]);

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Headers</span>
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
            onChange={e => updateHeader(id, 'key', e.target.value)}
          />
          <TextField
            label="Value"
            value={value}
            name="Value"
            onChange={e => updateHeader(id, 'value', e.target.value)}
          />
          <IconButton onClick={() => removeHeader(id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </Card>
  );
};
