import { isHttpMethod } from '@/lib/utils/is-http-method';
import { base64Decode } from '@/lib/utils/base64';
import { normalizeHeaders } from '@/lib/utils/normalize-headers';

type Props = {
  methodRaw: string;
  endpointRaw: string;
  bodyRaw: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const parseUrlFromServer = async ({
  methodRaw,
  endpointRaw,
  bodyRaw,
  searchParams,
}: Props) => {
  const method = isHttpMethod(methodRaw) ? methodRaw : 'GET';

  const url = endpointRaw ? base64Decode(decodeURIComponent(endpointRaw)) : '';

  const body = bodyRaw ? base64Decode(decodeURIComponent(bodyRaw)) : '';

  const rawHeaders = await searchParams;

  const headers: Record<string, string> = normalizeHeaders(rawHeaders);

  return { method, url, body, headers };
};
