'use client';

import { Button, Container, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link as IntlLink } from '@/i18n/navigation';
import Link from '@mui/material/Link';
import { ROUTES } from '@/sources/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import { auth, register } from '@/firebase';
import { enqueueSnackbar } from 'notistack';

export default function SignUp() {
  const t = useTranslations('SignUpPage');
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    try {
      await register(name, email, password);
      enqueueSnackbar(t('signupUserSuccess'), { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        `${t('signupUserError')} ${err instanceof Error ? err.message : ''}`,
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
        variant="outlined"
        value={name}
        onChange={e => setName(e.target.value)}
        label="Full Name"
      />
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
        className="px-6 py-3 text-black rounded-lg shadow-md bg-grey"
        onClick={handleSignUp}
        disabled={loading}
      >
        {t('signup')}
      </Button>
      <Typography>{t('alreadyHaveAccount')}</Typography>
      
      <Link component={IntlLink} href={ROUTES.login}>
        {t('login')}
      </Link>
    </Container>
  );
}
