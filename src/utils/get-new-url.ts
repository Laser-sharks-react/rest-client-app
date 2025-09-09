import { base64Encode } from '@/utils/base64';
import { headersArrayToObj } from './headers-array-to-obj';
import type { HttpHeader, HttpMethod } from '@/lib/types';

export const getNewUrl = (
  method: HttpMethod,
  url: string,
  body: string,
  headers: HttpHeader[]
) => {
  const encodedUrl = encodeURIComponent(base64Encode(url));
  console.log(body);
  const cleanBody = body.trim();
  const encodedBody =
    method !== 'GET' && cleanBody
      ? '/' + encodeURIComponent(base64Encode(cleanBody))
      : '';

  const headersObj = headersArrayToObj(headers);
  const query = new URLSearchParams(headersObj).toString();

  return `/${method}/${encodedUrl}${encodedBody}${query ? `?${query}` : ''}`;
};
