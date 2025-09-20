'use client';

import {
  Button,
  Card,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Stack,
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
      enqueueSnackbar(t('signUpUserSuccess'), { variant: 'success' });

      await login(email, password);
      enqueueSnackbar(t('loginUserSuccess'), { variant: 'success' });
      router.replace(ROUTES.home);
    } catch (err) {
      enqueueSnackbar(
        `${t('signUpUserError')} ${err instanceof Error ? err.message : ''}`,
        { variant: 'error' }
      );
    }
  };

  return (
    <Container
      sx={{
        minHeight: '90dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        component="form"
        sx={{ borderRadius: 2, p: 2, maxWidth: '400px' }}
        onSubmit={handleSubmit(handleSignUp)}
      >
        <Stack gap={2}>
          <Typography variant="h5" component="h2" gutterBottom>
            {t('title')}
          </Typography>
          <TextField
            id="name"
            label={tForm('name')}
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
          />

          <TextField
            id="email"
            label={tForm('e-mail')}
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            size="small"
          />

          <TextField
            id="password"
            label={tForm('password')}
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            size="small"
            helperText={errors.password?.message}
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

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !isValid}
          >
            {tForm('signup')}
          </Button>
          <Typography>
            {t('alreadyHaveAccount')}
            <Link component={IntlLink} href={ROUTES.login} ml={1}>
              {tForm('login')}
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
}
