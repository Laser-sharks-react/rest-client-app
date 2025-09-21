import { DEFAULT_HTTP_METHOD } from '@/lib/constants/request';
import type { RequestRecord } from '../types/request';
import { isHttpHeaderArray } from './is-http-header-array';
import { isMethod } from './is-method';
import { isRecord } from './is-record';

const asRecord = (value: unknown): Record<string, unknown> =>
  isRecord(value) ? value : {};

const toStringOr = (value: unknown, fallback: string): string =>
  typeof value === 'string' ? value : fallback;

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

const toNullableMethod = (value: unknown): RequestRecord['method'] =>
  isMethod(value) ? value : null;

const toNullableFinite = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const toFiniteOr = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

export function createRequestRecord(
  data: unknown,
  uidFallback: string
): RequestRecord {
  const rawData = asRecord(data);
  const restoreRaw = asRecord(rawData.restore);

  const method = toNullableMethod(rawData.method);
  const restoreMethod = isMethod(restoreRaw.method)
    ? restoreRaw.method
    : DEFAULT_HTTP_METHOD;
  const headers = isHttpHeaderArray(restoreRaw.headers)
    ? restoreRaw.headers
    : [];

  return {
    id: toStringOr(rawData.id, ''),
    uid: toStringOr(rawData.uid, uidFallback),
    endpoint: toStringOr(rawData.endpoint, ''),
    method,
    status: toNullableFinite(rawData.status),
    latencyMs: toNullableFinite(rawData.latencyMs),
    reqBytes: toFiniteOr(rawData.reqBytes, 0),
    resBytes: toFiniteOr(rawData.resBytes, 0),
    error: toNullableString(rawData.error),
    time: toFiniteOr(rawData.time, Date.now()),
    restore: {
      url: toStringOr(restoreRaw.url, ''),
      method: restoreMethod,
      headers,
      body: toStringOr(restoreRaw.body, ''),
    },
  };
}
