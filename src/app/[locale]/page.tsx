'use client';

import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';

export default function Page() {
  const t = useTranslations('HomePage');
  const [user] = useAuthState(auth);

  return (
    <Container className="h-[100dvh]">
      {t('title')}
      {user ? `, ${user.displayName}` : ''}!
    </Container>
  );
}
