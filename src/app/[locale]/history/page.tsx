import 'server-only';
import NextLink from 'next/link';
import { Container, Stack, Typography, Link as MUILink } from '@mui/material';
import { fetchUserHistory } from '@/utils/fetch-user-history';
import { getUserId } from '@/utils/get-user-id';
import { RequestList } from '@/components/request-list';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const t = await getTranslations('HistoryPage');
  const uid = await getUserId();
  if (!uid) {
    return <Typography> {t('unauthorized')}</Typography>;
  }

  const rows = await fetchUserHistory(uid, 200);

  return (
    <Container className="p-4">
      <Typography variant="h4" align="center" className="mb-4">
        {t('title')}
      </Typography>
      {rows.length ? (
        <RequestList rows={rows} />
      ) : (
        <Container className="text-center">
          <Typography variant="body2" className="text-gray-500 mb-4">
            {t('noRequests')}
          </Typography>

          <Stack className="space-y-2">
            <MUILink
              component={NextLink}
              href="/rest"
              underline="hover"
              className="text-blue-600"
            >
              {t('restLink')}
            </MUILink>
          </Stack>
        </Container>
      )}
    </Container>
  );
}
