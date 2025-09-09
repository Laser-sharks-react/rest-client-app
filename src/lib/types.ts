import type { useTranslations } from 'next-intl';

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
