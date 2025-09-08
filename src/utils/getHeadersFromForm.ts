import type { Header } from '@/components/request-headers';

export const getHeadersFromForm = (form: FormData): Header[] => {
  const entries: Header[] = [];
  const keys = form.getAll('Key').map(String);
  const values = form.getAll('Value').map(String);


  keys.forEach((key, i) => {
    const trimmedKey = key.trim();
    const trimmedValue = (values[i] ?? '').trim();

    if (trimmedKey !== '' || trimmedValue !== '') {
      entries.push({
        id: crypto.randomUUID(),
        key: trimmedKey,
        value: trimmedValue,
      });
    }
  });

  return entries;
};
