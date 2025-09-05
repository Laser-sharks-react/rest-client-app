'use client';

import { Link as IntlLink } from '@/i18n/navigation';
import { ROUTES } from '@/sources/routes';
import { Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from '@mui/material/Link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { auth, logInWithEmailAndPassword } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const t = useTranslations('LoginPage');
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await logInWithEmailAndPassword(email, password);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      void router.push(ROUTES.rest);
    }
  }, [loading, router, user]);

  return (
    <Container className="h-screen">
      <Typography variant="h4" component="h2" gutterBottom>
        {t('title')}
      </Typography>
      <div className="flex flex-col gap-y-4 items-center justify-center min-h-screen bg-gray-100">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
          className="text-black"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-mail Address"
          className="text-black"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="text-black"
        />
        <button
          className="px-6 py-3 text-black rounded-lg shadow-md bg-grey"
          onClick={handleLogin}
        >
          Login
        </button>
        {error && (
          <p className="text-red-600 font-medium">
            ❌ {error.message || 'An error occurred'}
          </p>
        )}
      </div>
      <Typography>{t('noAccount')}</Typography>
      <Link component={IntlLink} href={ROUTES.signup}>
        {t('signup')}
      </Link>
    </Container>
  );
}
