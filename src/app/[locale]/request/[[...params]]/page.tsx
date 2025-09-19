'use client';

import { type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getNewUrl } from '@/lib/utils/get-new-url';
import { RequestHeaders } from '@/components/request-headers';
import { CustomResponse } from '@/components/custom-response';
import { RequestSender } from '@/components/request-sender';
import { RequestBody } from '@/components/request-body';
import { useRequestStore } from '@/store/request-store';
import { GeneratedCodeSection } from '@/components/generated-code-section';
import { ROUTES } from '@/lib/constants/routes';
import { CircularProgress, Container, Stack } from '@mui/material';
import { useProxyResponse } from '@/lib/hooks/use-proxy-response';

export default function RequestPage() {
  const router = useRouter();
  const request = useRequestStore();
  const { response, isLoading, fetchData } = useProxyResponse();

  async function sendRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newUrl = getNewUrl(request);
    router.push(`${ROUTES.request}${newUrl}`);

    await fetchData(request);
  }

  return (
    <Container sx={{ p: 3 }}>
      <form onSubmit={sendRequest}>
        <Stack spacing={2}>
          <RequestSender />
          <RequestBody />
          <RequestHeaders />
          <GeneratedCodeSection />
          <div className="min-h-[200px]">
            {response && <CustomResponse response={response} />}
            {isLoading && <CircularProgress />}
          </div>
        </Stack>
      </form>
    </Container>
  );
}
