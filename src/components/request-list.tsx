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

      <TableContainer component={Paper} className="rounded border">
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
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <span className="text-xs px-2 py-0.5 rounded border">
                    {row.method}
                  </span>
                </TableCell>

                <TableCell title={row.endpoint}>
                  <span className="truncate inline-block max-w-[48ch] align-bottom">
                    {row.endpoint}
                  </span>
                </TableCell>

                <TableCell align="right" className="tabular-nums">
                  {row.status}
                </TableCell>

                <TableCell align="right" className="tabular-nums">
                  {row.latencyMs}
                </TableCell>

                <TableCell align="right" className="tabular-nums text-gray-600">
                  {formatBytes(row.reqBytes)} → {formatBytes(row.resBytes)}
                </TableCell>

                <TableCell align="right">
                  <time
                    className="text-sm text-gray-600"
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
                      className="text-blue-600"
                    >
                      {t('open')}
                    </MuiLink>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ul className="mt-2 text-xs text-red-600 space-y-1">
        {rows.map(row =>
          row.error ? (
            <li key={`${row.id}-err`}>
              [{row.method}] {row.endpoint}: {row.error}
            </li>
          ) : null
        )}
      </ul>
    </section>
  );
}
