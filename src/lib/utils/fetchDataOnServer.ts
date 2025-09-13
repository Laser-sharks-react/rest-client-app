import type { HttpMethod } from '@/lib/types/request';
import { ROUTES } from '@/lib/constants/routes';

export type ParsedUrl = {
  method: HttpMethod;
  url: string;
  body: string;
  headers: Record<string, string>;
};

export const fetchDataOnServer = async ({
  method,
  url,
  body,
  headers,
}: ParsedUrl) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.proxy}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, body, headers }),
      }
    );
    const json = await res.json();
    return { status: res.status, ok: res.ok, json };
  } catch (e) {
    return e instanceof Error ? { error: e.message } : { error: String(e) };
  }
};
