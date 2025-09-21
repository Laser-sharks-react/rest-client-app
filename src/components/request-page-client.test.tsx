import { screen } from '@testing-library/react';
import RequestPageClient from './request-page-client';
import type { ApiResponse } from '@/lib/types/response';
import { fireEvent, render } from '@testing-library/react';

const pushMock = jest.fn();

const requestFromStore = {
  method: 'POST',
  url: 'http://test',
  headers: [],
  body: '{"a":1}',
};

const fetchDataMock = jest.fn(async () => {});
const setResponseMock = jest.fn();
let responseRef: ApiResponse | null = null;
let isLoadingRef = false;

jest.mock('next/navigation', () => ({
  get useRouter() {
    return () => ({ push: pushMock });
  },
}));

jest.mock('@/store/request-store', () => ({
  useRequestStore: () => requestFromStore,
}));

jest.mock('@/lib/hooks/use-proxy-response', () => ({
  useProxyResponse: () => ({
    response: responseRef,
    isLoading: isLoadingRef,
    fetchData: fetchDataMock,
    setResponse: setResponseMock,
  }),
}));

const getNewUrlMock = jest.fn<string, [unknown]>(() => '?mocked=1');
const transformMock = jest.fn<unknown, [unknown]>((_arg: unknown) => ({
  transformed: true,
}));

jest.mock('@/lib/utils/get-new-url', () => ({
  getNewUrl: (arg: unknown) => getNewUrlMock(arg),
}));

jest.mock('@/lib/utils/variables/transform-request-with-variables', () => ({
  transformRequestWithVariables: (arg: unknown) => transformMock(arg),
}));

jest.mock('@/components/request-sender', () => ({
  RequestSender: () => <div data-testid="sender" />,
}));
jest.mock('@/components/request-body', () => ({
  RequestBody: () => <div data-testid="body" />,
}));
jest.mock('@/components/request-headers', () => ({
  RequestHeaders: () => <div data-testid="headers" />,
}));
jest.mock('@/components/generated-code-section', () => ({
  GeneratedCodeSection: () => <div data-testid="code" />,
}));
jest.mock('@/components/custom-response', () => ({
  CustomResponse: ({ response }: { response: ApiResponse }) => (
    <div data-testid="custom-response">{JSON.stringify(response)}</div>
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  responseRef = null;
  isLoadingRef = false;
});

describe('RequestPageClient', () => {
  test('mount with initialResponse calls setResponse(initialResponse)', () => {
    const initial: ApiResponse = { status: 200, ok: true, json: {} };
    render(<RequestPageClient initialResponse={initial} />);
    expect(setResponseMock).toHaveBeenCalledWith(initial);
  });

  test('submitting form pushes new URL', async () => {
    render(<RequestPageClient />);

    const form = document.querySelector('form');
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Expected form element');
    }

    fireEvent.submit(form);
    expect(transformMock).toHaveBeenCalledWith(requestFromStore);

    expect(getNewUrlMock).toHaveBeenCalledWith({ transformed: true });
    expect(pushMock).toHaveBeenCalledWith('/request?mocked=1');
    // expect(fetchDataMock).toHaveBeenCalledWith(requestFromStore);
  });

  test('shows loader when isLoading=true', () => {
    isLoadingRef = true;
    render(<RequestPageClient />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders CustomResponse when response exists', () => {
    responseRef = { status: 201, ok: true, json: { data: 1 } };
    render(<RequestPageClient />);
    const node = screen.getByTestId('custom-response');
    expect(node).toHaveTextContent(JSON.stringify(responseRef));
  });

  test('renders child sections', () => {
    render(<RequestPageClient />);
    expect(screen.getByTestId('sender')).toBeInTheDocument();
    expect(screen.getByTestId('body')).toBeInTheDocument();
    expect(screen.getByTestId('headers')).toBeInTheDocument();
    expect(screen.getByTestId('code')).toBeInTheDocument();
  });
});
