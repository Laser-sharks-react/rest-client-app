'use client';

import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link as IntlLink, useRouter } from '@/i18n/navigation';
import Link from '@mui/material/Link';
import { login, register as registerUser } from '@/lib/firebase';
import { useSnackbar } from 'notistack';
import type { SignUpFormValues } from '@/lib/types/types';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSignUpForm } from '@/lib/hooks/use-sign-up-form';
import { ROUTES } from '@/lib/constants/routes';

export default function SignUp() {
  const t = useTranslations('SignUpPage');
  const tForm = useTranslations('Form');
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useSignUpForm();
  const router = useRouter();

  const handleSignUp = async ({ email, name, password }: SignUpFormValues) => {
    try {
      await registerUser(name, email, password);
      enqueueSnackbar(t('signupUserSuccess'), { variant: 'success' });

      await login(email, password);
      enqueueSnackbar(t('loginUserSuccess'), { variant: 'success' });
      router.replace(ROUTES.home);
    } catch (err) {
      enqueueSnackbar(
        `${t('signupUserError')} ${err instanceof Error ? err.message : ''}`,
        { variant: 'error' }
      );
    }
  };

  return (
    <Container className="h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          className="text-[22px] leading-snug text-black"
        >
          {t('title')}
        </Typography>
        <form
          className="rounded-xl border border-zinc-300 p-5 space-y-3"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <FormControl fullWidth>
            <FormLabel htmlFor="name">{tForm('name')}</FormLabel>
            <TextField
              id="name"
              variant="outlined"
              size="small"
              {...register('name')}
              error={!!errors.name}
            />
            <FormHelperText
              sx={{ minHeight: 24, m: 0, fontSize: '10px', lineHeight: '1.2' }}
              error={!!errors.name}
            >
              {errors.name?.message ?? ' '}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="email">{tForm('e-mail')}</FormLabel>
            <TextField
              id="email"
              type="email"
              variant="outlined"
              size="small"
              {...register('email')}
              error={!!errors.email}
            />
            <FormHelperText
              sx={{ minHeight: 24, m: 0, fontSize: '10px', lineHeight: '1.2' }}
              error={!!errors.email}
            >
              {errors.email?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="password">{tForm('password')}</FormLabel>
            <TextField
              id="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              size="small"
              {...register('password')}
              error={!!errors.password}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label={
                          showPassword
                            ? tForm('hidePassword')
                            : tForm('showPassword')
                        }
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(prev => !prev)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormHelperText
              sx={{ minHeight: 24, m: 0, fontSize: '10px', lineHeight: '1.2' }}
              error={!!errors.name}
            >
              {errors.password?.message ?? ' '}
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            className="px-6 py-3 text-black rounded-lg shadow-md bg-grey"
            variant="contained"
            disabled={isSubmitting || !isValid}
          >
            {tForm('signup')}
          </Button>
          <Typography>
            {t('alreadyHaveAccount')}
            <Link component={IntlLink} href={ROUTES.login} className="ml-4">
              {tForm('login')}
            </Link>
          </Typography>
        </form>
      </div>
    </Container>
  );
}
