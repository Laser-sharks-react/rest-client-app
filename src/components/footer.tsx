import NextLink from 'next/link';

import Image from 'next/image';
import RSSLogo from '../../public/rss-logo.svg';

import { Box, Container, Stack, IconButton, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <Box component="footer" className="flex center bg-blue-100">
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-evenly"
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
      </Container>
    </Box>
  );
}
