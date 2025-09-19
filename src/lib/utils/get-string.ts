export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== 'string') {
    throw new Error(`Expected string for ${key}, got ${value}`);
  }
  return value;
}
