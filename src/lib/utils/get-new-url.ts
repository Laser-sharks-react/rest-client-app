import { base64Encode } from '@/lib/utils/base64';
import { headersArrayToObj } from './headers-array-to-obj';
import type { RequestState } from '@/lib/types/request';

export const getNewUrl = ({ method, url, body, headers }: RequestState) => {
  const encodedUrl = encodeURIComponent(base64Encode(url));
  const cleanBody = body.trim();
  const encodedBody =
    method !== 'GET' && cleanBody
      ? '/' + encodeURIComponent(base64Encode(cleanBody))
      : '';

  const headersObj = headersArrayToObj(headers);
  const query = new URLSearchParams(headersObj).toString();

  return `/${method}/${encodedUrl}${encodedBody}${query ? `?${query}` : ''}`;
};
