import type { Header } from '@/components/request-headers';

export function headersArrayToObj(headers: Header[]): Record<string, string> {
  return Object.fromEntries(
    headers.filter(h => h.key.trim() !== '').map(h => [h.key, h.value])
  );
}
