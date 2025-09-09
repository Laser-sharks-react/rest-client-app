import { useRequestStore } from '@/store/request-store';
import { base64Decode } from '@/utils/base64';
import { TextField } from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export function RequestBody() {
  const params = useParams();
  const [method, url, bodyParam] = params.params ?? [];

  const { body, setBody } = useRequestStore();

  useEffect(() => {
    if (bodyParam) setBody(base64Decode(bodyParam));
  }, []);

  return (
    <TextField
      label="Request Body"
      multiline
      minRows={6}
      fullWidth
      name="body"
      value={body}
      onChange={e => setBody(e.target.value)}
    />
  );
}
