'use client';

import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useScrollTrigger,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { ROUTES } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import cx from 'classnames';

export default function Header() {
  const t = useTranslations('Header');

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: typeof window !== 'undefined' ? window : undefined,
  });

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar
        className={cx(
          'flex justify-between transition-all duration-300 ease-in-out',
          {
            'bg-white shadow-sm ': trigger,
            'bg-blue-100 shadow-none': !trigger,
          }
        )}
      >
        <Typography component={NextLink} href={ROUTES.home}>
          {appName}
        </Typography>

        <Button
          component={NextLink}
          href={ROUTES.login}
          startIcon={<LoginIcon />}
        >
          {t('login')}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
