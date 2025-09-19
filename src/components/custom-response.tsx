import { type ApiResponse } from '@/lib/types/response';
import { Card, Chip, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type Props = {
  response: ApiResponse;
};

export const CustomResponse = ({ response }: Props) => {
  const t = useTranslations('Response');
  return (
    <Card className="p-4">
      <Stack direction="row" gap={2} alignItems="center">
        <Typography variant="h5">{t('response')}</Typography>
        {response.status && (
          <Chip
            label={response.status}
            color={response.status >= 400 ? 'error' : 'primary'}
            size="small"
          />
        )}
      </Stack>

      <div className="overflow-auto max-h-96">
        <SyntaxHighlighter
          language="json"
          style={prism}
          wrapLongLines
          customStyle={{ fontSize: '0.875rem', borderRadius: '0.5rem' }}
        >
          {JSON.stringify(response, null, 2)}
        </SyntaxHighlighter>
      </div>
    </Card>
  );
};
