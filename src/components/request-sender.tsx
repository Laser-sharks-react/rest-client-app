import { Button, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { allowedMethods } from '@/sources/constants';
import { useTranslations } from 'next-intl';

type Props = {
  method: string;
  setMethod: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
};

export const RequestSender = ({ method, setMethod, setUrl, url }: Props) => {
  const t = useTranslations('RestClientPage');

  return (
    <div className="flex gap-2">
      <Select
        name="method"
        value={method}
        onChange={e => setMethod(e.target.value)}
      >
        {allowedMethods.map(m => (
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
