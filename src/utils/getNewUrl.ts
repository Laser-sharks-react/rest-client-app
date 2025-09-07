import { base64Encode } from '@/utils/base64';

export const getNewUrl = (
  method: string,
  url: string,
  body: string,
  headers: Record<string, string>
) => {
  const encodedUrl = base64Encode(url);
  const cleanBody = body.trim();
  const encodedBody =
    method !== 'GET' && cleanBody ? '/' + base64Encode(cleanBody) : '';
  const query = new URLSearchParams(headers).toString();

  return `/rest/${method}/${encodedUrl}${encodedBody}${
    query ? `?${query}` : ''
  }`;
};
