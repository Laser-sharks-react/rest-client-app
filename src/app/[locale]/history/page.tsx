import 'server-only';
import NextLink from 'next/link';
import { Container, Stack, Typography, Link as MUILink } from '@mui/material';
import { fetchUserHistory } from '@/utils/fetch-user-history';
import { getUserId } from '@/utils/get-user-id';
import RequestList from '@/components/request-list';

export const dynamic = 'force-dynamic';

// const AnalyticsClient = NextDynamic(() => import('./parts/AnalyticsClient'), {
//   ssr: false,
// });

export default async function HistoryPage() {
  const uid = await getUserId();
  if (!uid) {
    return <div className="p-6">Unauthorized</div>;
  }

  const rows = await fetchUserHistory(uid, 200);

  return (
    <Container className="p-4">
      <Typography variant="h4" align="center" className="mb-4">
        History & Analytics
      </Typography>
      {rows.length ? (
        <RequestList rows={rows} />
      ) : (
        // <></>
        <Container className="text-center">
          <Typography variant="body2" className="text-gray-500 mb-4">
            You haven’t executed any requests yet.
          </Typography>

          <Stack className="space-y-2">
            <MUILink
              component={NextLink}
              href="/rest"
              underline="hover"
              className="text-blue-600"
            >
              Open REST client
            </MUILink>
          </Stack>
        </Container>
      )}
    </Container>
  );
}
