'use client';

import dynamic from 'next/dynamic';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import { auth } from '@/firebase';
import { ROUTES } from '@/sources/routes';
import { useEffect } from 'react';

const RestClient = dynamic(() => import('../../../../features/rest-client'), {
  ssr: false,
  loading: () => <CircularProgress />,
});

export default function RestPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(ROUTES.login);
    }
  }, [loading, user, router]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!user) {
    return null;
  }

  return <RestClient />;
}
