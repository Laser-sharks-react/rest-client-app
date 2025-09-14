'use client';

import type { Variable } from '@/lib/types/variable';
import { useVariablesStore } from '@/store/variables-store';
import { Add, Delete } from '@mui/icons-material';
import {
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export function VariablesList() {
  const {
    variables,
    removeVariable,
    addVariable,
    updateVariableKey,
    updateVariableValue,
  } = useVariablesStore();

  const onAdd = () => {
    addVariable();
  };
  const onUpdateKey = ({ key, id }: Omit<Variable, 'value'>) => {
    updateVariableKey({ key, id });
  };
  const onUpdateValue = ({ value, id }: Omit<Variable, 'key'>) => {
    updateVariableValue({ value, id });
  };

  const onRemove = (id: string) => {
    removeVariable(id);
  };

  return (
    <>
      <Card sx={{ p: 3, m: 3 }}>
        <Stack direction="row" gap={2} alignItems="center" mb={3}>
          <Typography variant="h5">Variables</Typography>
          <Button
            onClick={onAdd}
            variant="contained"
            sx={{ minWidth: 0, p: 1, borderRadius: 5 }}
          >
            <Add />
          </Button>
        </Stack>
        <Stack gap={2}>
          {variables.map(({ id, key, value }, index) => (
            <Stack key={index} direction="row" gap={2} alignItems="center">
              <TextField
                label="Key"
                name="Key"
                value={key}
                onChange={e => onUpdateKey({ id, key: e.target.value })}
              />
              <TextField
                label="Value"
                value={value}
                name="Value"
                onChange={e => onUpdateValue({ id, value: e.target.value })}
              />
              <IconButton onClick={() => onRemove(id)} color="error">
                <Delete />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Card>
    </>
  );
}
