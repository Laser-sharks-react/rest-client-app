import RequestPageClient from '@/components/request-page-client';

import { parseUrlToRequestPayload } from '@/lib/utils/parse-url-to-requset-payload';
import { fetchProxyRequest } from '@/lib/utils/fetch-proxy-request';
import { cookies } from 'next/headers';
import { COOKIES } from '@/lib/constants/cookie';

interface Props {
  params: Promise<{ params?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RequestPage({ params, searchParams }: Props) {
  const request = await parseUrlToRequestPayload({
    params,
    searchParams,
  });
  const sessionCookies = (await cookies()).get(COOKIES.session)?.value;
  request.headers = { ...request.headers, Cookie: `session=${sessionCookies}` };
  const response = request.url ? await fetchProxyRequest(request) : undefined;
  return <RequestPageClient initialResponse={response} />;
}
