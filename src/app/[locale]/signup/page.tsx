'use client';
import { Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link as IntlLink } from '@/i18n/navigation';
import Link from '@mui/material/Link';
import { ROUTES } from '@/sources/routes';

export default function SignUp() {
  const t = useTranslations('SignUpPage');
  return (
    <Container className="h-screen">
      <Typography variant="h4" component="h2" gutterBottom>
        {t('title')}
      </Typography>

      <Typography>{t('alreadyHaveAccount')}</Typography>
      <Link component={IntlLink} href={ROUTES.login}>
        {t('login')}
      </Link>
    </Container>
  );
}
