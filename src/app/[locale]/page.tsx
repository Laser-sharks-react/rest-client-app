'use client';

import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function Page() {
  const t = useTranslations('HomePage');
  const [user] = useAuthState(auth);

  return (
    <Container className="mt-20 flex items-center justify-center text-center ">
      {t('title')}
      {user ? `, ${user.displayName}` : ''}!
    </Container>
  );
}
