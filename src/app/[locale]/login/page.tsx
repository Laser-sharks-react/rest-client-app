'use client';

import { Link as IntlLink } from '@/i18n/navigation';
import { ROUTES } from '@/sources/routes';
import { Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from '@mui/material/Link';

export default function Login() {
  const t = useTranslations('LoginPage');
  return (
    <Container className="h-screen">
      <Typography variant="h4" component="h2" gutterBottom>
        {t('title')}
      </Typography>
      <Typography>{t('noAccount')}</Typography>
      <Link component={IntlLink} href={ROUTES.signup}>
        {t('signup')}
      </Link>
    </Container>
  );
}
