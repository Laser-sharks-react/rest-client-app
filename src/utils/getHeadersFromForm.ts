export const getHeadersFromForm = (form: FormData) => {
  return Array.from(form.entries()).reduce<Record<string, string>>(
    (acc, [name, key]) => {
      if (!name.startsWith('header-key-')) return acc;
      if (typeof key !== 'string' || !key) return acc;

      const index = name.split('-').pop();
      const value = form.get(`header-value-${index}`);

      if (typeof value === 'string') {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
};
