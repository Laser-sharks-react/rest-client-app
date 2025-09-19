import RequestPageClient from '@/components/request-page-client';

import { parseUrlToRequestPayload } from '@/lib/utils/parse-url-to-requset-payload';
import { fetchProxyRequest } from '@/lib/utils/fetch-proxy-request';
interface Props {
  params: Promise<{ params?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RequestPage({ params, searchParams }: Props) {
  const request = await parseUrlToRequestPayload({
    params,
    searchParams,
  });
  const response = await fetchProxyRequest(request);

  return <RequestPageClient initialResponse={response} />;
}
