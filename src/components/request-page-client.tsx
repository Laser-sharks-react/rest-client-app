'use client';

import { type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNewUrl } from '@/lib/utils/get-new-url';
import { RequestHeaders } from '@/components/request-headers';
import { CustomResponse } from '@/components/custom-response';
import { RequestSender } from '@/components/request-sender';
import { RequestBody } from '@/components/request-body';
import { useRequestStore } from '@/store/request-store';
import { GeneratedCodeSection } from '@/components/generated-code-section';
import { ROUTES } from '@/lib/constants/routes';
import { CircularProgress, Stack } from '@mui/material';
import { useProxyResponse } from '@/lib/hooks/use-proxy-response';
import type { ApiResponse } from '@/lib/types/response';
import { transformRequestWithVariables } from '@/lib/utils/variables/transform-request-with-variables';

type Props = {
  initialResponse?: ApiResponse;
};

export default function RequestPageClient({ initialResponse }: Props) {
  const router = useRouter();
  const request = useRequestStore();
  const { response, isLoading, setResponse } = useProxyResponse();

  useEffect(() => {
    if (initialResponse) setResponse(initialResponse);
  }, [initialResponse, setResponse]);

  async function sendRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newUrl = getNewUrl(transformRequestWithVariables(request));
    router.push(`${ROUTES.request}${newUrl}`);
  }

  return (
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
  );
}
