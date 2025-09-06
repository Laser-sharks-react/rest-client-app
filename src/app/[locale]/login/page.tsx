'use client';

import { Link as IntlLink, useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/sources/routes';
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from '@mui/material/Link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import { auth, login } from '@/firebase';
import { enqueueSnackbar } from 'notistack';

export default function Login() {
  const t = useTranslations('LoginPage');
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await login(email, password);
      enqueueSnackbar(t('loginUserSuccess'), { variant: 'success' });
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
        <form className="rounded-xl border border-zinc-300 p-5 space-y-3">
          <FormControl fullWidth>
            <FormLabel htmlFor="email">{t('e-mail')}</FormLabel>
            <TextField
              id="email"
              type="email"
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              size="small"
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="password">{t('password')}</FormLabel>
            <TextField
              id="password"
              type="password"
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              size="small"
            />
          </FormControl>
          <Button
            disabled={loading}
            className="px-6 py-3 text-black rounded-lg shadow-md bg-grey"
            onClick={handleRegister}
            variant="contained"
          >
            {t('login')}
          </Button>
          <Typography>
            {t('noAccount')}
            <Link component={IntlLink} href={ROUTES.signup} className="ml-4">
              {t('signup')}
            </Link>
          </Typography>
        </form>
      </div>
    </Container>
  );
}
