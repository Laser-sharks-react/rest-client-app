import type { RequestRecord, RequestState } from '../types/request';

export function isRequestState(
  restore: RequestRecord['restore']
): restore is RequestState {
  return restore.method !== null && Array.isArray(restore.headers);
}
