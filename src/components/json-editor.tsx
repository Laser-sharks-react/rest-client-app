'use client';

import { useCallback, useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';

type Props = {
  initial?: string;
  onValidChange?: (s: string) => void;
  indent?: number;
  minHeight?: number | string;
};

export default function JsonEditor({
  initial,
  onValidChange,
  indent = 2,
  minHeight = 180,
}: Props) {
  const t = useTranslations('JsonEditor');
  const theme = useTheme();
  const [code, setCode] = useState<string>(
    initial || '{\n  "hello": "world"\n}'
  );
  const [error, setError] = useState<string | null>(null);

  const highlight = useCallback(
    (src: string) => Prism.highlight(src, Prism.languages.json ?? {}, 'json'),
    []
  );

  useEffect(() => {
    try {
      JSON.parse(code);
      setError(null);
      onValidChange?.(code);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }, [code, onValidChange]);

  const format = useCallback(() => {
    try {
      const pretty = JSON.stringify(JSON.parse(code), null, indent);
      setCode(pretty);
    } catch {}
  }, [code, indent]);

  const hasError = Boolean(error);

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: hasError ? 'error.main' : 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={highlight}
          padding={12}
          textareaId="json-editor"
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: 14,
            lineHeight: 1.5,
            minHeight: Number(minHeight) || 180,
            outline: 'none',
            background: theme.palette.background.paper,
          }}
        />
      </CardContent>

      <CardActions
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          px: 1.5,
          py: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%' }}
        >
          <Button
            type="button"
            onClick={format}
            disabled={hasError}
            variant="contained"
            size="small"
          >
            {t('format')}
          </Button>

          <Typography
            variant="caption"
            sx={{
              ml: 'auto',
              color: hasError ? 'error.main' : 'success.main',
            }}
          >
            {hasError ? `${t('invalid')}: ${error}` : t('valid')}
          </Typography>
        </Stack>
      </CardActions>
    </Card>
  );
}
