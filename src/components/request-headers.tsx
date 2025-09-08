import { Card, IconButton, TextField } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import React from 'react';

type Props = {
  headers: Record<string, string>;
  setHeaders: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  headersCount: number;
  setHeadersCount: React.Dispatch<React.SetStateAction<number>>;
};

export const RequestHeaders = ({
  headers,
  setHeadersCount,
  headersCount,
  setHeaders,
}: Props) => {
  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Headers</span>
        <IconButton onClick={() => setHeadersCount(c => c + 1)}>
          <AddIcon />
        </IconButton>
      </div>
      {Array.from({ length: headersCount }).map((_, i) => {
        const keys = Object.keys(headers);
        const key = keys[i] ?? '';
        const value = headers[key] ?? '';
        return (
          <div key={i} className="flex gap-2 items-center">
            <TextField
              label="Key"
              name={`header-key-${i}`}
              value={key}
              onChange={e =>
                setHeaders(prev => {
                  const newH = { ...prev };
                  const oldKey = keys[i];
                  if (oldKey && oldKey !== e.target.value) {
                    delete newH[oldKey];
                  }
                  newH[e.target.value] = value;
                  return newH;
                })
              }
            />
            <TextField
              label="Value"
              name={`header-value-${i}`}
              value={value}
              onChange={e =>
                setHeaders(prev => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
            />
            <IconButton
              onClick={() => {
                const newH = { ...headers };
                delete newH[key];
                setHeaders(newH);
                setHeadersCount(c => Math.max(0, c - 1));
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      })}
    </Card>
  );
};
