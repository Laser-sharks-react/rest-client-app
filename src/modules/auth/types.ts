import type { useTranslations } from 'next-intl';

export interface FormValues {
  email: string;
  password: string;
}

export interface SignUpFormValues extends FormValues {
  name: string;
}

export type TFunc = ReturnType<typeof useTranslations>;
