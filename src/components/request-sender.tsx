import { Button, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { base64Decode } from '@/utils/base64';
import { useRequestStore } from '@/store/request-store';
import { DEFAULT_HTTP_METHOD, HTTP_METHODS } from '@/lib/constants';
import { isHttpMethod } from '@/utils/is-http-method';

export const RequestSender = () => {
  const t = useTranslations('RestClientPage');
  const params = useParams();
  const [methodParam, urlParam] = params.params ?? [];

  const { setMethod, setUrl, method, url } = useRequestStore();

  useEffect(() => {
    setMethod(isHttpMethod(methodParam) ? methodParam : DEFAULT_HTTP_METHOD);
    setUrl(urlParam ? base64Decode(decodeURIComponent(urlParam)) : '');
  }, []);

  return (
    <div className="flex gap-2">
      <Select
        name="method"
        value={method}
        onChange={e => setMethod(e.target.value)}
      >
        {HTTP_METHODS.map(m => (
          <MenuItem key={m} value={m}>
            {m}
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
      <Button type="submit" variant="contained">
        {t('button')}
      </Button>
    </div>
  );
};
