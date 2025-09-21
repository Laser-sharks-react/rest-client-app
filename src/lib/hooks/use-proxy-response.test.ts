jest.mock('@/lib/utils/variables/transform-request-with-variables', () => ({
  transformRequestWithVariables: jest.fn(request => request),
}));

jest.mock('@/lib/utils/fetch-proxy-request', () => ({
  fetchProxyRequest: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
import { useProxyResponse } from '@/lib/hooks/use-proxy-response';
import { fetchProxyRequest } from '@/lib/utils/fetch-proxy-request';
import { transformRequestWithVariables } from '@/lib/utils/variables/transform-request-with-variables';
import type { RequestState } from '@/lib/types/request';
import type { ApiResponse } from '@/lib/types/response';

const mockedFetchProxyRequest = jest.mocked(fetchProxyRequest);
const mockedTransformRequestWithVariables = jest.mocked(
  transformRequestWithVariables
);

const request: RequestState = {
  url: 'https://api.test/users',
  method: 'GET',
  body: '',
  headers: [],
};

const apiResponse: ApiResponse = {
  ok: true,
  status: 200,
  json: { message: 'ok' },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useProxyResponse', () => {
  it('resets loading flag and stores response on success', async () => {
    mockedFetchProxyRequest.mockResolvedValue(apiResponse);
    mockedTransformRequestWithVariables.mockReturnValue(request);

    const { result } = renderHook(() => useProxyResponse());

    await act(async () => {
      await result.current.fetchData(request);
    });

    expect(mockedTransformRequestWithVariables).toHaveBeenCalledWith(request);
    expect(mockedFetchProxyRequest).toHaveBeenCalledWith({
      url: request.url,
      method: request.method,
      body: request.body,
      headers: {},
    });
    expect(result.current.response).toEqual(apiResponse);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns error response when request fails', async () => {
    mockedFetchProxyRequest.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useProxyResponse());

    await act(async () => {
      await result.current.fetchData(request);
    });

    expect(result.current.response).toEqual({
      ok: false,
      status: 400,
      json: { error: 'Error: boom' },
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('exposes setResponse to override response manually', () => {
    const { result } = renderHook(() => useProxyResponse());
    const customResponse: ApiResponse = {
      ok: false,
      status: 500,
      json: { error: 'error' },
    };

    act(() => {
      result.current.setResponse(customResponse);
    });

    expect(result.current.response).toEqual(customResponse);
  });
});
