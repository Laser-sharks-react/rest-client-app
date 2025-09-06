import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('HomePage');
  return <Container className="h-[100dvh]">{t('title')}</Container>;
}
