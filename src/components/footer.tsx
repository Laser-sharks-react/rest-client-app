import NextLink from 'next/link';

import Image from 'next/image';
import RSSLogo from '../../public/rss-logo.svg';

import { Stack, IconButton, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('Footer');
  return (
    <Stack
      component="footer"
      className="bg-blue-100"
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-evenly"
      alignItems="center"
      py={2}
    >
      <IconButton
        component={NextLink}
        href="https://github.com/Laser-sharks-react/rest-client-app"
        target="_blank"
      >
        <GitHubIcon />
      </IconButton>

      <Typography
        className="flex items-center text-center"
        variant="body2"
        color="textSecondary"
      >
        2025
      </Typography>
      <IconButton
        component={NextLink}
        target="_blank"
        href="https://rs.school/courses/reactjs"
      >
        <Image height={24} src={RSSLogo} alt={t('rss')} />
      </IconButton>
    </Stack>
  );
}
