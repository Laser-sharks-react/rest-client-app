'use client';

import { Link as IntlLink, useRouter } from '@/i18n/navigation';
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
import Link from '@mui/material/Link';
import { useState } from 'react';
import { login } from '@/lib/firebase';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginForm } from '@/lib/hooks/use-login-form';
import type { FormValues } from '@/lib/types/types';
import { useSnackbar } from 'notistack';
import { ROUTES } from '@/lib/constants/routes';

export default function Login() {
  const t = useTranslations('LoginPage');
  const tForm = useTranslations('Form');
  const tErrors = useTranslations('FormErrors');
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useLoginForm();
  const router = useRouter();

  const handleLogin = async ({ email, password }: FormValues) => {
    try {
      await login(email, password);
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
        onSubmit={handleSubmit(handleLogin)}
      >
        <Stack gap={2}>
          <Typography variant="h5" component="h2" gutterBottom>
            {t('title')}
          </Typography>
          <TextField
            id="email"
            type="email"
            label={tForm('e-mail')}
            size="small"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            id="password"
            type={showPassword ? 'text' : 'password'}
            label={tForm('password')}
            variant="outlined"
            size="small"
            {...register('password')}
            error={!!errors.password}
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
            {tForm('login')}
          </Button>
          <Typography>
            {t('noAccount')}
            <Link component={IntlLink} href={ROUTES.signup} ml={1}>
              {tForm('signup')}
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Container>
  );
}
