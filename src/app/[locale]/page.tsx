import { Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('HomePage');
  return <Container className="h-[100dvh]">{t('title')}</Container>;
}
