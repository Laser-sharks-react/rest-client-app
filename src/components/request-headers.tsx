'use client';

import { Card, IconButton, TextField } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import React from 'react';

export type Header = { id: string; key: string; value: string };

type Props = {
  headers: Header[];
  setHeaders: React.Dispatch<React.SetStateAction<Header[]>>;
};

export const RequestHeaders = ({ headers, setHeaders }: Props) => {
  const addHeader = () => {
    setHeaders(prev => [
      ...prev,
      { id: crypto.randomUUID(), key: '', value: '' },
    ]);
  };

  const updateHeader = (id: string, field: 'key' | 'value', value: string) => {
    setHeaders(prev =>
      prev.map(h => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  const deleteHeader = (id: string) => {
    setHeaders(prev => prev.filter(h => h.id !== id));
  };

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Headers</span>
        <IconButton onClick={addHeader}>
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
          <IconButton onClick={() => deleteHeader(id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </Card>
  );
};
