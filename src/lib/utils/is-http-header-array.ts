import type { HttpHeader } from '../types/request';
import { isRecord } from './is-record';

export const isHttpHeaderArray = (value: unknown): value is HttpHeader[] =>
  Array.isArray(value) &&
  value.every(
    item =>
      isRecord(item) &&
      typeof item.key === 'string' &&
      'value' in item &&
      (typeof item.value === 'string' ||
        typeof item.value === 'number' ||
        item.value === '')
  );
