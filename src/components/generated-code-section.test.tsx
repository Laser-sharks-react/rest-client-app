import { render, screen, fireEvent } from '@testing-library/react';
import { GeneratedCodeSection } from './generated-code-section';
import { LANGUAGES } from '@/lib/constants/request';
import type { RequestState, Language } from '@/lib/types/request';

jest.mock('@/store/request-store', () => ({
  __esModule: true as const,
  useRequestStore: jest.fn(),
}));
import { useRequestStore } from '@/store/request-store';
const mockedUseRequestStore = jest.mocked(useRequestStore);

jest.mock('@/lib/utils/variables/transform-request-with-variables', () => ({
  __esModule: true as const,
  transformRequestWithVariables: jest.fn(),
}));

import { transformRequestWithVariables } from '@/lib/utils/variables/transform-request-with-variables';
const mockedTransform = jest.mocked(transformRequestWithVariables);

jest.mock('@/lib/utils/code-generators', () => ({
  __esModule: true as const,
  generateCode: jest.fn(),
}));
import { generateCode } from '@/lib/utils/code-generators';
const mockedGenerateCode = jest.mocked(generateCode);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GeneratedCodeSection', () => {
  test('renders tabs for all languages and shows "not enough data" when url/method missing', () => {
    const emptyState: RequestState = {
      method: 'GET',
      url: '',
      body: '',
      headers: [],
    };
    mockedUseRequestStore.mockReturnValue(emptyState);
    mockedTransform.mockImplementation((req: RequestState) => req);

    render(<GeneratedCodeSection />);

    LANGUAGES.forEach(label => {
      expect(screen.getByRole('tab', { name: label })).toBeInTheDocument();
    });

    expect(screen.getByText('RequestSender.notEnoughData')).toBeInTheDocument();

    expect(mockedGenerateCode).not.toHaveBeenCalled();
  });

  test('generates code for initial language (cURL) when url/method present', () => {
    const state: RequestState = {
      method: 'POST',
      url: 'https://example.com',
      body: '{ "ok" : true }',
      headers: [],
    };
    mockedUseRequestStore.mockReturnValue(state);

    mockedTransform.mockImplementation((req: RequestState) => req);

    mockedGenerateCode.mockImplementation(
      ({ lang, request }: { lang: Language; request: RequestState }) => {
        return `${lang}:${request.method}@${request.url}`;
      }
    );

    render(<GeneratedCodeSection />);

    expect(mockedGenerateCode).toHaveBeenCalledWith({
      lang: 'cURL',
      request: state,
    });
    expect(
      screen.getByText('cURL:POST@https://example.com')
    ).toBeInTheDocument();
  });

  test('switching tab changes language and regenerates code', () => {
    const state: RequestState = {
      method: 'GET',
      url: 'https://example.net',
      body: '',
      headers: [],
    };
    mockedUseRequestStore.mockReturnValue(state);
    mockedTransform.mockImplementation((req: RequestState) => req);
    mockedGenerateCode.mockImplementation(
      ({ lang, request }: { lang: Language; request: RequestState }) => {
        return `${lang}:${request.method}@${request.url}`;
      }
    );

    render(<GeneratedCodeSection />);

    const targetLang = LANGUAGES.length > 1 ? LANGUAGES[1] : LANGUAGES[0];
    const tab = screen.getByRole('tab', { name: targetLang });
    fireEvent.click(tab);

    const lastCall =
      mockedGenerateCode.mock.calls[mockedGenerateCode.mock.calls.length - 1];
    expect(lastCall?.[0]).toEqual({ lang: targetLang, request: state });

    expect(
      screen.getByText(`${targetLang}:GET@https://example.net`)
    ).toBeInTheDocument();
  });
});
