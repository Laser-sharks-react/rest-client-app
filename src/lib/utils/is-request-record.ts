import { type RequestRecord, type HttpMethod } from '../types/request';
import { isMethod } from './is-method';
import { isRecord } from './is-record';
import { isHttpHeaderArray } from './is-http-header-array';

const isNullableFiniteNumber = (value: unknown): value is number | null =>
  (typeof value === 'number' && Number.isFinite(value)) || value === null;

const isNullableString = (value: unknown): value is string | null =>
  typeof value === 'string' || value === null;

const isNullableMethod = (value: unknown): value is HttpMethod | null =>
  value === null || isMethod(value);

const isRestore = (value: unknown): value is RequestRecord['restore'] => {
  if (!isRecord(value)) return false;
  if (typeof value.url !== 'string') return false;
  if (!isNullableMethod(value.method)) return false;
  if (!(value.headers === null || isHttpHeaderArray(value.headers)))
    return false;
  if (typeof value.body !== 'string') return false;
  return true;
};

export function isRequestRecord(obj: unknown): obj is RequestRecord {
  if (!isRecord(obj)) return false;

  if (typeof obj.id !== 'string') return false;
  if (typeof obj.uid !== 'string') return false;
  if (typeof obj.endpoint !== 'string') return false;

  if (!isNullableMethod(obj.method)) return false;
  if (!isNullableFiniteNumber(obj.status)) return false;
  if (!isNullableFiniteNumber(obj.latencyMs)) return false;

  if (!(typeof obj.reqBytes === 'number' && Number.isFinite(obj.reqBytes)))
    return false;
  if (!(typeof obj.resBytes === 'number' && Number.isFinite(obj.resBytes)))
    return false;

  if (!isNullableString(obj.error)) return false;

  if (!(typeof obj.time === 'number' && Number.isFinite(obj.time)))
    return false;

  if (!isRestore(obj.restore)) return false;

  return true;
}
