'use client';
import { Link } from '@/i18n/navigation';
import { Button, Toolbar, useScrollTrigger } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  TabOutlined,
  InboxOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';
import cx from 'classnames';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export function RestClientNavbar() {
  const t = useTranslations('RestClientLayout');
  const [user] = useAuthState(auth);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: typeof window !== 'undefined' ? window : undefined,
  });

  if (!user) return null;
  return (
    <Toolbar
      sx={{
        justifyContent: 'space-around',
        position: 'sticky',
        top: theme => theme.mixins.toolbar.minHeight,
        zIndex: theme => theme.zIndex.appBar - 1,
        transition: 'all 0.3ms ease-in-out',
      }}
      className={cx({
        'bg-blue-300': trigger,
        'bg-blue-200': !trigger,
      })}
    >
      <Button
        component={Link}
        href={ROUTES.request}
        startIcon={<TabOutlined />}
      >
        {t('request')}
      </Button>

      <Button
        component={Link}
        href={ROUTES.variables}
        startIcon={<InboxOutlined />}
      >
        {t('variables')}
      </Button>

      <Button
        component={Link}
        href={ROUTES.history}
        startIcon={<ScheduleOutlined />}
      >
        {t('history')}
      </Button>
    </Toolbar>
  );
}
