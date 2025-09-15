import type { useTranslations } from 'next-intl';
import { HTTP_METHODS } from '@/lib/constants/request';

export type FormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = {
  name: string;
} & FormValues;

export type TFunc = ReturnType<typeof useTranslations>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpHeader {
  id: string;
  key: string;
  value: string;
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

export type RequestRecord = {
  id: string;
  uid: string;
  endpoint: string;
  method: HttpMethod;
  status: number | null;
  latencyMs: number | null;
  reqBytes: number;
  resBytes: number;
  error: string | null;
  time: number;
  restore: {
    url: string;
    method: HttpMethod;
    headers: HttpHeader[];
    body: string | null;
  };
};

export function isMethod(value: unknown): value is HttpMethod {
  if (typeof value !== 'string') return false;
  for (const method of HTTP_METHODS) {
    if (method === value) return true;
  }
  return false;
}
