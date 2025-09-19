export function searchParamsToHeadersObj(
  searchParams: Record<string, string | string[] | undefined>
) {
  const headers: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(', ');
    }
  }

  return headers;
}
