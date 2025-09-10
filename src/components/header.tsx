'use client';

import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useScrollTrigger,
  Stack,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { ROUTES } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import cx from 'classnames';
import { LangSelector } from './lang-selector';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '@/firebase';
import { enqueueSnackbar } from 'notistack';

export default function Header() {
  const t = useTranslations('Header');
  const [user] = useAuthState(auth);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: typeof window !== 'undefined' ? window : undefined,
  });

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const onLogout = () => {
    try {
      logout();
      enqueueSnackbar(t('logoutSuccess'), { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        `${t('logoutError')} ${err instanceof Error ? err.message : ''}`,
        { variant: 'error' }
      );
    }
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar
        className={cx(
          'flex justify-between transition-all duration-300 ease-in-out',
          {
            'bg-white': trigger,
            'bg-blue-100': !trigger,
          }
        )}
      >
        <Typography
          component={NextLink}
          href={ROUTES.home}
          sx={{ fontSize: '30px', fontWeight: 600 }}
          className={cx('text-blue-900')}
        >
          {appName}
        </Typography>

        <Stack direction="row">
          <LangSelector />

          {!user && (
            <Button
              component={NextLink}
              href={ROUTES.login}
              startIcon={<LoginIcon />}
            >
              {t('login')}
            </Button>
          )}
          {user && (
            <Button
              component={NextLink}
              href={ROUTES.login}
              onClick={onLogout}
              startIcon={<LoginIcon />}
            >
              {t('logout')}
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
