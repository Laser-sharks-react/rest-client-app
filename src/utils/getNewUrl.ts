import { base64Encode } from '@/utils/base64';
import type { HttpMethod, HttpHeader } from '@/sources/types';
import { headersArrayToObj } from './headersArrayToObj';

export const getNewUrl = (
  method: HttpMethod,
  url: string,
  body: string,
  headers: HttpHeader[]
) => {
  const encodedUrl = base64Encode(url);

  const cleanBody = body.trim();
  const encodedBody =
    method !== 'GET' && cleanBody ? '/' + base64Encode(cleanBody) : '';

  const headersObj = headersArrayToObj(headers);
  const query = new URLSearchParams(headersObj).toString();

  return `/${method}/${encodedUrl}${encodedBody}${query ? `?${query}` : ''}`;
};
