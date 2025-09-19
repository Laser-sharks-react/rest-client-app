import {
  Container,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function Page() {
  const t = useTranslations('HomePage');

  return (
    <Container className="h-[100dvh] flex flex-col justify-center items-center gap-8 py-6">
      <Typography variant="h3" component="h1" className="text-center font-bold">
        {t('title')}
      </Typography>

      <div className="flex gap-4">
        <Button
          component={Link}
          href={ROUTES.login}
          variant="contained"
          color="primary"
        >
          {t('signIn')}
        </Button>
        <Button
          component={Link}
          href={ROUTES.signup}
          variant="outlined"
          color="secondary"
        >
          {t('signUp')}
        </Button>
      </div>

      <Card className="w-full max-w-2xl shadow-md">
        <CardContent>
          <Typography variant="h5" gutterBottom className="pb-4">
            {t('aboutProjectTitle')}
          </Typography>
          <Typography variant="body1">{t('aboutProjectText')}</Typography>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl shadow-md">
        <CardContent>
          <Typography variant="h5" gutterBottom className="pb-4">
            {t('aboutTeamTitle')}
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
          >
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
            >
              <Avatar
                src="/images/starkoans_avatar.jpeg"
                alt="Developer 1"
                sx={{ width: 64, height: 64, mb: 1 }}
              />
              <Typography variant="subtitle1">{t('developer1')}</Typography>
              <Typography variant="body2">
                {t('teamLeadDescription')}
              </Typography>
            </Box>

            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
            >
              <Avatar
                src="/images/aissatsana_avatar.jpeg"
                alt="Developer 2"
                sx={{ width: 64, height: 64, mb: 1 }}
              />
              <Typography variant="subtitle1">{t('developer2')}</Typography>
              <Typography variant="body2">{t('dev1Description')}</Typography>
            </Box>

            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
            >
              <Avatar
                src="/images/ulistonee_avatar.jpeg"
                alt="Developer 3"
                sx={{ width: 64, height: 64, mb: 1 }}
              />
              <Typography variant="subtitle1">{t('developer3')}</Typography>
              <Typography variant="body2">{t('dev2Description')}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl shadow-md">
        <CardContent>
          <Typography variant="h5" gutterBottom className="pb-4">
            {t('aboutCourseTitle')}
          </Typography>
          <Typography variant="body1">{t('aboutCourseText')}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
