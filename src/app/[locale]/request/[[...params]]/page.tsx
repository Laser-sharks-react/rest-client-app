import { parseUrlToRequestPayload } from '@/lib/utils/parse-url-to-requset-payload';
import { fetchProxyRequest } from '@/lib/utils/fetch-proxy-request';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import { getSessionToken } from '@/lib/utils/session-token';

interface Props {
  params: Promise<{ params?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const RequestPageClient = dynamic(
  () => import('@/components/request-page-client'),
  {
    loading: () => <CircularProgress />,
  }
);

export default async function RequestPage({ params, searchParams }: Props) {
  const request = await parseUrlToRequestPayload({
    params,
    searchParams,
  });
  const sessionCookies = await getSessionToken();
  request.headers = { ...request.headers, Cookie: `session=${sessionCookies}` };
  const response = request.url ? await fetchProxyRequest(request) : undefined;

  return <RequestPageClient initialResponse={response} />;
}
