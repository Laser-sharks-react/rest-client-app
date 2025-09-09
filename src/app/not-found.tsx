import { getTranslations } from 'next-intl/server';
import NextLink from 'next/link';
import { Container, Typography } from '@mui/material';
import { ROUTES } from '@/lib/constants/routes';

export default async function NotFound() {
  const t = await getTranslations('NotFoundPage');

  return (
    <Container className="h-screen flex flex-col items-center justify-center gap-4">
      <Typography variant="h5">{t('title')}</Typography>
      <Typography variant="body1">{t('description')}</Typography>

      <NextLink href={ROUTES.home} className="text-blue-500 hover:underline">
        {t('goHome')}
      </NextLink>
      </NextLink>
    </Container>
  );
}
