import { getString } from '@/utils/getString';
import { getHeadersFromForm } from '@/utils/getHeadersFromForm';
import type { Header } from '@/components/request-headers';

export const getRawDataFromForm = (
  form: FormData
): {
  method: string;
  url: string;
  body: string;
  headers: Header[];
} => {
  const method = getString(form, 'method');
  const url = getString(form, 'url');
  const body = getString(form, 'body');
  const headers = getHeadersFromForm(form);

  return { method, url, body, headers };
};
