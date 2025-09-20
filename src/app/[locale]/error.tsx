'use client';

import { Button } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Error() {
  const t = useTranslations('ErrorPage');

  return (
    <div className="min-h-[60vh] grid place-items-center px-6 py-16">
      <div className="text-center max-w-xl">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-neutral-500">{t('description')}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button component={Link} href="/" variant="outlined">
            {t('goHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
