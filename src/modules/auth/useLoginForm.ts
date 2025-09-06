// src/modules/auth/useLoginForm.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { buildLoginSchema } from './validation';
import type { FormValues } from './types';
import { useTranslations } from 'next-intl';

export const useLoginForm = () => {
  const t = useTranslations('FormErrors');
  const schema = buildLoginSchema(t);

  return useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });
};
