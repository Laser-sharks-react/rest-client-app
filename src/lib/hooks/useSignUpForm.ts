import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useTranslations } from 'next-intl';
import { buildSignUpSchema } from '../schemas/sign-up-schema';
import { type SignUpFormValues } from '../types';

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
