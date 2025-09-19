export function base64Encode(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

export function base64Decode(str: string): string {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}
