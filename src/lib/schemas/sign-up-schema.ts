import * as yup from 'yup';
import type { TFunc } from '../types';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants';

export const buildSignUpSchema = (t: TFunc) =>
  yup.object({
    name: yup
      .string()
      .transform(v => (v ?? '').trim())
      .min(1, t('name.min'))
      .required(t('required')),
    email: yup
      .string()
      .matches(EMAIL_REGEX, t('email.format'))
      .required(t('required')),
    password: yup
      .string()
      .matches(PASSWORD_REGEX, t('password.strong'))
      .required(t('required')),
  });
