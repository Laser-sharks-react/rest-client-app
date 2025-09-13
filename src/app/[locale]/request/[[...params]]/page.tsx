import RequestPageClient from '@/components/request-page-client';
import { parseUrlFromServer } from '@/lib/utils/parseUrlFromServer';
import { fetchDataOnServer } from '@/lib/utils/fetchDataOnServer';

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ params?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { params: catchAllParams = [] } = await params;
  const [methodRaw, endpointRaw, bodyRaw] =
    catchAllParams.length > 0 ? catchAllParams : [];

  const parsedUrl = await parseUrlFromServer({
    methodRaw,
    endpointRaw,
    bodyRaw,
    searchParams,
  });

  const response = await fetchDataOnServer(parsedUrl);

  return <RequestPageClient initialResponse={response} />;
}
