import 'server-only';
import { dbAdmin } from '@/lib/firebase-admin';
import { type RequestRecord, isMethod } from '@/lib/types';

export async function fetchUserHistory(
  uid: string,
  limit = 100
): Promise<RequestRecord[]> {
  const snap = await dbAdmin
    .collection('users')
    .doc(uid)
    .collection('requests')
    .orderBy('time', 'desc')
    .limit(limit)
    .get();

  const rows: RequestRecord[] = snap.docs.map(doc => {
    const data = doc.data();

    const restoreRaw =
      data && typeof data === 'object' && data.restore ? data.restore : {};

    const headers: Record<string, string> =
      restoreRaw &&
      typeof restoreRaw.headers === 'object' &&
      !Array.isArray(restoreRaw.headers)
        ? Object.fromEntries(
            Object.entries(restoreRaw.headers).map(([key, value]) => [
              String(key),
              String(value),
            ])
          )
        : {};

    const method = isMethod(data.method) ? data.method : 'GET';
    const restoreMethod = isMethod(restoreRaw.method)
      ? restoreRaw.method
      : 'GET';

    const time = data.time;

    return {
      id: doc.id,
      uid: typeof data.uid === 'string' ? data.uid : uid,
      endpoint: typeof data.endpoint === 'string' ? data.endpoint : '',
      method,
      status: typeof data.status === 'number' ? data.status : null,
      latencyMs: typeof data.latencyMs === 'number' ? data.latencyMs : null,
      reqBytes: Number.isFinite(data.reqBytes) ? Number(data.reqBytes) : 0,
      resBytes: Number.isFinite(data.resBytes) ? Number(data.resBytes) : 0,
      error: typeof data.error === 'string' ? data.error : null,
      time,
      restore: {
        url: typeof restoreRaw.url === 'string' ? restoreRaw.url : '',
        method: restoreMethod,
        headers,
        body: typeof restoreRaw.body === 'string' ? restoreRaw.body : null,
      },
    };
  });

  return rows;
}
