'use client';

import { Add, Delete } from '@mui/icons-material';
import { Card, IconButton, Stack, TextField, Typography } from '@mui/material';

type Variable = {
  key: string;
  value: string;
};

export function VariablesList() {
  const onAdd = () => {};
  const onUpdateKey = () => {};
  const onUpdateValue = () => {};
  const onRemove = () => {};

  return (
    <>
      <Card sx={{ p: 3, m: 3 }}>
        <Stack direction="row" gap={2} alignItems="center" mb={3}>
          <Typography variant="h5">Variables</Typography>
          <IconButton onClick={onAdd}>
            <Add />
          </IconButton>
        </Stack>

        {[{ key: 'val', value: '123' }].map(({ key, value }, index) => (
          <div key={index} className="flex gap-2 items-center">
            <TextField
              label="Key"
              name="Key"
              value={key}
              onChange={onUpdateKey}
            />
            <TextField
              label="Value"
              value={value}
              name="Value"
              onChange={onUpdateValue}
            />
            <IconButton onClick={onRemove}>
              <Delete />
            </IconButton>
          </div>
        ))}
      </Card>
    </>
  );
}
