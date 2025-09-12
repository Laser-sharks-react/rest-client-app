import type { HttpHeader } from '@/lib/types';

export function headersArrayToObj(
  headers: HttpHeader[]
): Record<string, string> {
  return Object.fromEntries(
    headers.filter(h => h.key.trim() !== '').map(h => [h.key, h.value])
  );
}
