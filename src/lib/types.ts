import type { useTranslations } from 'next-intl';

export type FormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = {
  name: string;
} & FormValues;

export type TFunc = ReturnType<typeof useTranslations>;
