import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoryPage from './page';
import type { RequestRecord } from '@/lib/types/request';

const getUserIdMock = jest.fn<Promise<string | null>, []>();
jest.mock('@/lib/utils/session/get-user-id', () => ({
  getUserId: () => getUserIdMock(),
}));

const getUserRequestsMock = jest.fn<
  Promise<RequestRecord[]>,
  [string, number]
>();
jest.mock('@/lib/firebase-admin', () => ({
  getUserRequests: (uid: string, limit: number) =>
    getUserRequestsMock(uid, limit),
}));

jest.mock('@/components/request-list', () => ({
  RequestList: ({ rows }: { rows: RequestRecord[] }) => (
    <div data-testid="request-list">rows:{rows.length}</div>
  ),
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

beforeEach(() => {
  jest.clearAllMocks();
});

describe('HistoryPage', () => {
  test('when user is not authorized renders unauthorized message', async () => {
    getUserIdMock.mockResolvedValueOnce(null);

    const ui = await HistoryPage();
    render(ui);

    expect(screen.getByText('HistoryPage.unauthorized')).toBeInTheDocument();
    expect(screen.queryByTestId('request-list')).not.toBeInTheDocument();
  });

  test('when user has requests renders RequestList with rows', async () => {
    getUserIdMock.mockResolvedValueOnce('uid-1');

    getUserRequestsMock.mockResolvedValueOnce(rows);

    const ui = await HistoryPage();
    render(ui);
    expect(screen.getByText('HistoryPage.title')).toBeInTheDocument();

    expect(screen.getByTestId('request-list')).toHaveTextContent('rows:2');

    expect(
      screen.queryByText('HistoryPage.noRequests')
    ).not.toBeInTheDocument();
  });

  test('when no requests renders empty state with link to /request', async () => {
    getUserIdMock.mockResolvedValueOnce('uid-1');
    getUserRequestsMock.mockResolvedValueOnce([]);

    const ui = await HistoryPage();
    render(ui);

    expect(screen.getByText('HistoryPage.title')).toBeInTheDocument();
    expect(screen.getByText('HistoryPage.noRequests')).toBeInTheDocument();

    const restLink = screen.getByRole('link', { name: 'HistoryPage.restLink' });
    expect(restLink).toHaveAttribute('href', '/request');

    expect(screen.queryByTestId('request-list')).not.toBeInTheDocument();
  });
});
