import { DEFAULT_HTTP_METHOD } from '@/lib/constants/request';
import { setUserRequest } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/utils/get-user-id-from-request';
import { type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const uid = await getUserIdFromRequest(req);
  if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const started = Date.now();
  const { url, method, body, headers } = await req.json();
  const reqBytes = body ? Buffer.byteLength(body, 'utf8') : 0;
  const endpointURL = new URL(url);
  const endpoint = endpointURL.origin + endpointURL.pathname;
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: method !== DEFAULT_HTTP_METHOD ? body : '',
    });

    const arrayBuffer = await res.arrayBuffer();
    const resBytes = arrayBuffer.byteLength;

    const contentType = res.headers.get('content-type') || '';
    const text = new TextDecoder().decode(arrayBuffer);
    let data: unknown = text;
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch {}
    }

    await setUserRequest({
      uid,
      endpoint,
      method: method || null,
      status: res.status,
      latencyMs: Date.now() - started,
      reqBytes,
      resBytes,
      time: started,
      restore: {
        url,
        method: method || null,
        headers: headers || null,
        body,
      },
      ...(res.ok ? {} : { error: `HTTP ${res.status}` }),
    });
    return Response.json(
      res.ok
        ? { status: res.status, ok: true, json: data }
        : {
            status: res.status,
            ok: false,
            error: `HTTP ${res.status}`,
            json: data,
          },
      { status: res.status }
    );
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);

    const now = Date.now();
    await setUserRequest({
      uid,
      endpoint,
      method: method || null,
      status: null,
      error,
      latencyMs: now - started,
      time: started,
      reqBytes: reqBytes,
      resBytes: 0,
      restore: {
        url,
        method: method || null,
        headers: headers || null,
        body: body,
      },
    });

    return Response.json({ error }, { status: 500 });
  }
}
