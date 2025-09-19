import { isHttpMethod } from '@/lib/utils/is-http-method';
import { base64Decode } from '@/lib/utils/base64';
import { searchParamsToHeadersObj } from '@/lib/utils/normalize-headers';
import type { RequestPayload } from '../types/request';
import { DEFAULT_HTTP_METHOD } from '../constants/request';

type Props = {
  params: Promise<{ params?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const parseUrlToRequestPayload = async ({
  params,
  searchParams,
}: Props): Promise<RequestPayload> => {
  const { params: cathAllParams } = await params;
  const [methodRaw, endpointRaw, bodyRaw] = cathAllParams || [];

  const headers: Record<string, string> = searchParamsToHeadersObj(
    await searchParams
  );
  const method = isHttpMethod(methodRaw) ? methodRaw : DEFAULT_HTTP_METHOD;
  const url = endpointRaw ? base64Decode(decodeURIComponent(endpointRaw)) : '';
  const body = bodyRaw ? base64Decode(decodeURIComponent(bodyRaw)) : '';

  return { method, url, body, headers };
};
