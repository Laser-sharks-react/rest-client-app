import { getString } from '@/utils/getString';
import { getHeadersFromForm } from '@/utils/getHeadersFromForm';

export const getRawDataFromForm = (form: FormData) => {
  const method = getString(form, 'method');
  const url = getString(form, 'url');
  const body = getString(form, 'body');
  const headers = getHeadersFromForm(form);

  return { method, url, body, headers };
};
