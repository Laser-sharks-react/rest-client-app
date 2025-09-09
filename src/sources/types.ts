export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpHeader {
  id: string;
  key: string;
  value: string;
}

export function isHttpMethod(value: unknown): value is HttpMethod {
  return (
    typeof value === 'string' &&
    (value === 'GET' ||
      value === 'POST' ||
      value === 'PUT' ||
      value === 'PATCH' ||
      value === 'DELETE')
  );
}

type SuccessResponse = {
  status: number;
  ok: boolean;
  json: unknown;
};

type ErrorResponse = {
  error: string;
};

export type ApiResponse = SuccessResponse | ErrorResponse | null;
