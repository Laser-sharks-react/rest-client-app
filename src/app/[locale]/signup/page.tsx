'use client';

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
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
            <FormLabel>Full Name</FormLabel>
            <TextField
              variant="outlined"
              value={name}
              onChange={e => setName(e.target.value)}
              size="small"
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>E-mail Address</FormLabel>
            <TextField
              type="email"
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              size="small"
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Password</FormLabel>
            <TextField
              type="password"
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              size="small"
            />
          </FormControl>

          <Button
            className="px-6 py-3 text-black rounded-lg shadow-md bg-grey"
            onClick={handleSignUp}
            disabled={loading}
            variant="contained"
          >
            {t('signup')}
          </Button>
          <Typography>
            {t('alreadyHaveAccount')}
            <Link component={IntlLink} href={ROUTES.login} className="ml-4">
              {t('login')}
            </Link>
          </Typography>
        </form>
      </div>
    </Container>
  );
}
