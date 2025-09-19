import 'server-only';
import NextLink from 'next/link';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Link as MuiLink,
  Chip,
} from '@mui/material';
import type { RequestRecord } from '@/lib/types/request';
import { formatBytes } from '@/lib/utils/format-bytes';
import { useTranslations } from 'next-intl';
import { getNewUrl } from '@/lib/utils/get-new-url';
import { ROUTES } from '@/lib/constants/routes';
import { isRequestState } from '@/lib/utils/is-request-state';

export function RequestList({ rows }: { rows: RequestRecord[] }) {
  const t = useTranslations('RequestList');

  return (
    <section>
      <Typography variant="h6" className="mb-2">
        {t('title')}
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small" aria-label="request history">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell> {t('method')}</TableCell>
              <TableCell> {t('endpoint')}</TableCell>
              <TableCell align="right"> {t('status')}</TableCell>
              <TableCell align="right"> {t('latency')}</TableCell>
              <TableCell align="right">
                {t('sizes')} ({t('req')} → {t('res')})
              </TableCell>
              <TableCell align="right"> {t('timestamp')}</TableCell>
              <TableCell align="right"> {t('action')}</TableCell>
              <TableCell>Error Details</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id} hover sx={{ cursor: 'pointer' }}>
                <TableCell>
                  <Chip color="primary" size="small" label={row.method} />
                </TableCell>

                <TableCell title={row.endpoint} sx={{ maxWidth: '48ch' }}>
                  <Typography noWrap>{row.endpoint}</Typography>
                </TableCell>

                <TableCell align="right" className="tabular-nums">
                  {row.status}
                </TableCell>

                <TableCell align="right" className="tabular-nums">
                  {row.latencyMs}
                </TableCell>

                <TableCell
                  align="right"
                  className="tabular-nums"
                  sx={{ color: 'text.disabled' }}
                >
                  {formatBytes(row.reqBytes)} → {formatBytes(row.resBytes)}
                </TableCell>

                <TableCell align="right" sx={{ color: 'text.disabled' }}>
                  <time
                    className="text-sm"
                    dateTime={new Date(row.time).toISOString()}
                  >
                    {new Date(row.time).toLocaleString()}
                  </time>
                </TableCell>

                <TableCell align="right">
                  {isRequestState(row.restore) ? (
                    <MuiLink
                      component={NextLink}
                      href={`${ROUTES.request}${getNewUrl(row.restore)}`}
                      underline="hover"
                    >
                      {t('open')}
                    </MuiLink>
                  ) : null}
                </TableCell>
                <TableCell sx={{ fontSize: 12, color: 'tomato' }}>
                  {row.error}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
