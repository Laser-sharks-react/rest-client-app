import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <Container className="h-screen flex items-center justify-center">
      <h1>{t('title')}</h1>
    </Container>
  );
}
