'use client';

import { Link as IntlLink, useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
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
import Link from '@mui/material/Link';
import { useState } from 'react';
import { login } from '@/firebase';
import { enqueueSnackbar } from 'notistack';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginForm } from '@/lib/hooks/useLoginForm';
import type { FormValues } from '@/lib/types';

export default function Login() {
  const t = useTranslations('LoginPage');
  const tForm = useTranslations('Form');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useLoginForm();

  const handleRegister = async (data: FormValues) => {
    try {
      await login(data.email, data.password);
      enqueueSnackbar(t('loginUserSuccess'), { variant: 'success' });
      router.replace(ROUTES.home);
    } catch (err) {
      enqueueSnackbar(
        `${t('loginUserError')} ${err instanceof Error ? err.message : ''}`,
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
          onSubmit={handleSubmit(handleRegister)}
        >
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
              sx={{
                minHeight: 24,
                m: 0,
                fontSize: '10px',
                lineHeight: '1.2',
              }}
              error={!!errors.email}
            >
              {errors.email?.message ?? ' '}
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
              sx={{
                minHeight: 24,
                m: 0,
                fontSize: '10px',
                lineHeight: '1.2',
              }}
              error={!!errors.password}
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
            {tForm('login')}
          </Button>
          <Typography>
            {t('noAccount')}
            <Link component={IntlLink} href={ROUTES.signup} className="ml-4">
              {tForm('signup')}
            </Link>
          </Typography>
        </form>
      </div>
    </Container>
  );
}
