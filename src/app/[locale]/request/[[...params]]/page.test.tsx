import { COOKIES } from '@/lib/constants/cookie';
import type { RequestPayload } from '@/lib/types/request';

jest.mock('@/lib/utils/parse-url-to-requset-payload', () => ({
  parseUrlToRequestPayload: jest.fn(),
}));

jest.mock('@/lib/utils/fetch-proxy-request', () => ({
  fetchProxyRequest: jest.fn(),
}));

jest.mock('@/lib/utils/session/get-session-token', () => ({
  getSessionToken: jest.fn(),
}));

import RequestPage from './page';
import { parseUrlToRequestPayload } from '@/lib/utils/parse-url-to-requset-payload';
import { fetchProxyRequest } from '@/lib/utils/fetch-proxy-request';
import { getSessionToken } from '@/lib/utils/session/get-session-token';
import { type ApiResponse } from '@/lib/types/response';

const parseUrlToRequestPayloadMock = jest.mocked(parseUrlToRequestPayload);
const fetchProxyRequestMock = jest.mocked(fetchProxyRequest);
const getSessionTokenMock = jest.mocked(getSessionToken);

const paramsPromise = Promise.resolve({ params: ['GET', 'foo'] });
const searchParamsPromise = Promise.resolve({});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RequestPage', () => {
  it('passes parsed request to fetch and returns component with response', async () => {
    const parsedRequest: RequestPayload = {
      method: 'GET',
      url: 'https://api.test/resource',
      body: '',
      headers: {
        Authorization: 'Bearer token',
      },
    };
    parseUrlToRequestPayloadMock.mockResolvedValue(parsedRequest);
    getSessionTokenMock.mockResolvedValue('session-token');
    const response: ApiResponse = { ok: true, json: {}, status: 200 };
    fetchProxyRequestMock.mockResolvedValue(response);

    const element = await RequestPage({
      params: paramsPromise,
      searchParams: searchParamsPromise,
    });

    expect(parseUrlToRequestPayloadMock).toHaveBeenCalledWith({
      params: paramsPromise,
      searchParams: searchParamsPromise,
    });
    expect(fetchProxyRequestMock).toHaveBeenCalledWith({
      ...parsedRequest,
      headers: {
        Authorization: 'Bearer token',
        Cookie: `${COOKIES.session}=session-token`,
      },
    });
    expect(element.props.initialResponse).toEqual(response);
  });

  it('skips proxy request when url is empty', async () => {
    const parsedRequest: RequestPayload = {
      method: 'POST',
      url: '',
      body: 'payload',
      headers: {},
    };
    parseUrlToRequestPayloadMock.mockResolvedValue(parsedRequest);
    getSessionTokenMock.mockResolvedValue('session-token');

    const element = await RequestPage({
      params: paramsPromise,
      searchParams: searchParamsPromise,
    });

    expect(fetchProxyRequestMock).not.toHaveBeenCalled();
    expect(element.props.initialResponse).toBeUndefined();
    expect(parsedRequest.headers.Cookie).toEqual(
      `${COOKIES.session}=session-token`
    );
  });
});
