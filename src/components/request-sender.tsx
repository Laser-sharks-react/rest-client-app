import {
  Button,
  Card,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { base64Decode } from '@/lib/utils/base64';
import { useRequestStore } from '@/store/request-store';
import { isHttpMethod } from '@/lib/utils/is-http-method';
import { DEFAULT_HTTP_METHOD, HTTP_METHODS } from '@/lib/constants/request';

export const RequestSender = () => {
  const t = useTranslations('RequestSender');
  const { params } = useParams();
  const [methodParam, urlParam] = params ?? [];

  const { setMethod, setUrl, method, url } = useRequestStore();

  useEffect(() => {
    if (methodParam)
      setMethod(isHttpMethod(methodParam) ? methodParam : DEFAULT_HTTP_METHOD);
    if (urlParam)
      setUrl(urlParam ? base64Decode(decodeURIComponent(urlParam)) : '');
  }, [methodParam, setMethod, setUrl, urlParam]);

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" gap={2}>
        <Select
          name="method"
          value={method}
          onChange={e => setMethod(e.target.value)}
        >
          {HTTP_METHODS.map(method => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          value={url}
          onChange={e => setUrl(e.target.value)}
          label="Endpoint URL"
          name="url"
        />
        <Button type="submit" variant="contained" disabled={!url}>
          {t('button')}
        </Button>
      </Stack>
    </Card>
  );
};
