import { DEFAULT_HTTP_METHOD } from '@/lib/constants';
import { dbAdmin } from '@/lib/firebase-admin';
import { getUserIdFromRequest } from '@/utils/get-user-id-from-request';
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
      body: method !== DEFAULT_HTTP_METHOD ? body : undefined,
    });

    const ab = await res.arrayBuffer();
    const resBytes = ab.byteLength;

    const contentType = res.headers.get('content-type') || '';
    const text = new TextDecoder().decode(ab);
    let data: unknown = text;
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch {}
    }

    const endpointURL = new URL(url);
    await dbAdmin
      .collection('users')
      .doc(uid)
      .collection('requests')
      .add({
        uid,
        endpoint: endpointURL.origin + endpointURL.pathname,
        method,
        status: res.status,
        latencyMs: Date.now() - started,
        reqBytes,
        resBytes,
        error: null,
        time: Date.now(),
        restore: {
          url,
          method,
          headers: headers || {},
          body: body || null,
        },
      });

    return Response.json({ status: res.status, ok: res.ok, json: data });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);

    const now = Date.now();
    await dbAdmin
      .collection('users')
      .doc(uid)
      .collection('requests')
      .add({
        uid,
        endpoint: 'proxy_error',
        method: 'GET',
        status: null,
        latencyMs: now - started,
        reqBytes: 0,
        resBytes: 0,
        error,
        time: now,
        restore: {
          url: '',
          method: 'GET',
          headers: {},
          body: null,
        },
      });

    return Response.json({ error }, { status: 500 });
  }
}
