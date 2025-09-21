import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RequestList } from './request-list';
import type { RequestRecord } from '@/lib/types/request';

jest.mock('@/lib/utils/format-bytes', () => ({
  formatBytes: (number: number) => `${number}b`,
}));

const getNewUrlMock = jest.fn<string, [unknown]>(() => '?mocked=1');

jest.mock('@/lib/utils/get-new-url', () => ({
  getNewUrl: (arg: unknown) => getNewUrlMock(arg),
}));

jest.mock('@/lib/utils/is-request-state', () => ({
  isRequestState: (restore: { url: string }) => Boolean(restore.url),
}));

const rows: RequestRecord[] = [
  {
    uid: 'userId',
    id: 'id1',
    method: 'GET',
    endpoint: 'https://example1.com',
    status: 200,
    latencyMs: 123,
    reqBytes: 0,
    resBytes: 200,
    time: 1758449459964,
    restore: {
      url: 'https://example1.com',
      method: 'GET',
      body: '',
      headers: [],
    },
    error: '',
  },
  {
    uid: 'userId',
    id: 'id2',
    method: 'POST',
    endpoint: 'https://example2.com',
    status: 500,
    latencyMs: 456,
    reqBytes: 100,
    resBytes: 300,
    time: 1758449459964,
    restore: {
      url: '',
      method: 'POST',
      body: '',
      headers: [],
    },
    error: 'Bad Request',
  },
];

describe('RequestList', () => {
  test('renders title and table headers', () => {
    render(<RequestList rows={rows} />);

    expect(screen.getByText('RequestList.title')).toBeInTheDocument();

    expect(screen.getByText('RequestList.method')).toBeInTheDocument();
    expect(screen.getByText('RequestList.endpoint')).toBeInTheDocument();
    expect(screen.getByText('RequestList.status')).toBeInTheDocument();
    expect(screen.getByText('RequestList.latency')).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', {
        name: /RequestList\.sizes.*\(.*RequestList\.req.*→.*RequestList\.res.*\)/,
      })
    ).toBeInTheDocument();
    expect(screen.getByText('RequestList.timestamp')).toBeInTheDocument();
    expect(screen.getByText('RequestList.action')).toBeInTheDocument();
    expect(screen.getByText('Error Details')).toBeInTheDocument();
  });

  test('renders rows with values (method, endpoint, status, latency, sizes, time, error)', () => {
    const { container } = render(<RequestList rows={rows} />);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();

    expect(screen.getByText(rows[0].endpoint)).toBeInTheDocument();
    expect(screen.getByText(rows[1].endpoint)).toBeInTheDocument();

    expect(screen.getByText(String(rows[0].status))).toBeInTheDocument();
    expect(screen.getByText(String(rows[1].status))).toBeInTheDocument();
    expect(screen.getByText(String(rows[0].latencyMs))).toBeInTheDocument();
    expect(screen.getByText(String(rows[1].latencyMs))).toBeInTheDocument();

    expect(screen.getByText('0b → 200b')).toBeInTheDocument();
    expect(screen.getByText('100b → 300b')).toBeInTheDocument();

    const times = Array.from(container.querySelectorAll('time'));
    expect(times).toHaveLength(2);
    expect(times[0].getAttribute('dateTime')).toBe(
      new Date(rows[0].time).toISOString()
    );
    expect(times[1].getAttribute('dateTime')).toBe(
      new Date(rows[1].time).toISOString()
    );

    expect(screen.getByText('Bad Request')).toBeInTheDocument();
  });

  test('renders "open" link only when isRequestState is true and builds href via getNewUrl', () => {
    render(<RequestList rows={rows} />);

    const openLinks = screen.getAllByRole('link', { name: 'RequestList.open' });

    expect(openLinks).toHaveLength(1);
    expect(openLinks[0]).toHaveAttribute('href', '/request?mocked=1');

    expect(getNewUrlMock).toHaveBeenCalledWith(rows[0].restore);
  });
});
