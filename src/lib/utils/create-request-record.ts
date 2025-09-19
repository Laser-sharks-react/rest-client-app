import type { RequestRecord } from '../types/request';
import { isHttpHeaderArray } from './is-http-header-array';
import { isMethod } from './is-method';
import { isRecord } from './is-record';

export function createRequestRecord(
  data: unknown,
  uidFallback: string
): RequestRecord {
  const rawData = isRecord(data) ? data : {};
  const restoreRaw = isRecord(rawData.restore) ? rawData.restore : {};

  const method = isMethod(rawData.method) ? rawData.method : null;
  const restoreMethod = isMethod(restoreRaw.method) ? restoreRaw.method : null;
  const headers =
    'headers' in restoreRaw && isHttpHeaderArray(restoreRaw.headers)
      ? restoreRaw.headers
      : [];

  return {
    id: typeof rawData.id === 'string' ? rawData.id : '',
    uid: typeof rawData.uid === 'string' ? rawData.uid : uidFallback,
    endpoint: typeof rawData.endpoint === 'string' ? rawData.endpoint : '',
    method,
    status: typeof rawData.status === 'number' ? rawData.status : null,
    latencyMs: typeof rawData.latencyMs === 'number' ? rawData.latencyMs : null,
    reqBytes: Number.isFinite(rawData.reqBytes) ? Number(rawData.reqBytes) : 0,
    resBytes: Number.isFinite(rawData.resBytes) ? Number(rawData.resBytes) : 0,
    error: typeof rawData.error === 'string' ? rawData.error : null,
    time: typeof rawData.time === 'number' ? rawData.time : Date.now(),
    restore: {
      url: typeof restoreRaw.url === 'string' ? restoreRaw.url : '',
      method: restoreMethod,
      headers,
      body: typeof restoreRaw.body === 'string' ? restoreRaw.body : '',
    },
  };
}
