import { DEFAULT_HTTP_METHOD } from '@/lib/constants/request';
import { dbAdmin, setUserRequest } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/lib/utils/get-user-id-from-request';
import { type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const uid = await getUserIdFromRequest(req);
  if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const started = Date.now();
  const { url, method, body, headers } = await req.json();
  const reqBytes = body ? Buffer.byteLength(body, 'utf8') : 0;

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

    const endpointURL = new URL(url);
    await setUserRequest({
      uid,
      endpoint: endpointURL.origin + endpointURL.pathname,
      method,
      status: res.status,
      latencyMs: Date.now() - started,
      reqBytes,
      resBytes,
      time: Date.now(),
      restore: {
        url,
        method,
        headers: headers || {},
        body: body || null,
      },
    });
    // await dbAdmin
    //   .collection('users')
    //   .doc(uid)
    //   .collection('requests')
    //   .add({
    //     uid,
    //     endpoint: endpointURL.origin + endpointURL.pathname,
    //     method,
    //     status: res.status,
    //     latencyMs: Date.now() - started,
    //     reqBytes,
    //     resBytes,
    //     error: null,
    //     time: Date.now(),
    //     restore: {
    //       url,
    //       method,
    //       headers: headers || {},
    //       body: body || null,
    //     },
    //   });

    return Response.json({ status: res.status, ok: res.ok, json: data });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);

    const now = Date.now();
    await setUserRequest({
      uid,
      error,
      endpoint: 'proxy_error',
      latencyMs: now - started,
      time: now,
    });
    // await dbAdmin
    //   .collection('users')
    //   .doc(uid)
    //   .collection('requests')
    //   .add({
    //     uid,
    //     endpoint: 'proxy_error',
    //     method: DEFAULT_HTTP_METHOD,
    //     status: null,
    //     latencyMs: now - started,
    //     reqBytes: 0,
    //     resBytes: 0,
    //     error,
    //     time: now,
    //     restore: {
    //       url: '',
    //       method: DEFAULT_HTTP_METHOD,
    //       headers: {},
    //       body: '',
    //     },
    //   });

    return Response.json({ error }, { status: 500 });
  }
}
