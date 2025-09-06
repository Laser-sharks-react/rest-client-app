import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { buildSignUpSchema } from './validation';
import type { SignUpFormValues } from './types';
import { useTranslations } from 'next-intl';

export const useSignUpForm = () => {
  const t = useTranslations('FormErrors');
  const schema = buildSignUpSchema(t);

  const form = useForm<SignUpFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '' },
  });

  return form;
};
