import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { FormValues } from '../types';
import { useTranslations } from 'next-intl';
import { buildLoginSchema } from '../schemas/login-schema';

export const useLoginForm = () => {
  const t = useTranslations('FormErrors');
  const schema = buildLoginSchema(t);

  return useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });
};
