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
import { useTranslations } from 'next-intl';
import cx from 'classnames';
import { LangSelector } from './lang-selector';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '@/lib/firebase';
import { ROUTES } from '@/lib/constants/routes';
import { useSnackbar } from 'notistack';
import Image from 'next/image';
import AppLogo from '../../public/shark-bite-logo.svg';
import { useRequestStore } from '@/store/request-store';
import { useVariablesStore } from '@/store/variables-store';

export default function Header() {
  const t = useTranslations('Header');
  const { enqueueSnackbar } = useSnackbar();
  const { reset: resetRequest } = useRequestStore();
  const { reset: resetVariables } = useVariablesStore();

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
      resetRequest();
      resetVariables();
      enqueueSnackbar(t('logoutSuccess'), { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        `${t('logoutError')} ${err instanceof Error ? err.message : ''}`,
        { variant: 'error' }
      );
    }
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        className={cx(
          'flex justify-between transition-all duration-300 ease-in-out bg-white',
          { 'bg-blue-200': trigger }
        )}
      >
        <Typography
          component={NextLink}
          href={ROUTES.home}
          color="primary"
          sx={{
            fontSize: 24,
            display: 'inline-flex',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          <Image height={40} src={AppLogo} alt={'logo'} />
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
