'use client';

import { Link as IntlLink } from '@/i18n/navigation';
import { ROUTES } from '@/sources/routes';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from '@mui/material/Link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import { auth, login, register } from '@/firebase';
import { enqueueSnackbar } from 'notistack';

export default function Login() {
  const t = useTranslations('LoginPage');
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

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
    <Container className="h-screen">
      <Typography variant="h4" component="h2" gutterBottom>
        {t('title')}
      </Typography>

      <TextField
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        label="E-mail Address"
      />
      <TextField
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        label="Password"
      />
      <Button
        disabled={loading}
        className="px-6 py-3 text-black rounded-lg shadow-md bg-grey"
        onClick={handleRegister}
      >
        {t('login')}
      </Button>
      <Typography>{t('noAccount')}</Typography>
      <Link component={IntlLink} href={ROUTES.signup}>
        {t('signup')}
      </Link>
    </Container>
  );
}
