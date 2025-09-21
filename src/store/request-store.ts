import type { HttpHeader, HttpMethod, RequestState } from '@/lib/types/request';
import { create } from 'zustand';
import { DEFAULT_HTTP_METHOD } from '@/lib/constants/request';

type Actions = {
  setMethod: (m: HttpMethod) => void;
  setUrl: (u: string) => void;
  setBody: (b: string) => void;

  addHeader: (init?: Partial<HttpHeader>) => void;
  updateHeaderKey: (p: { id: string; key: string }) => void;
  updateHeaderValue: (p: { id: string; value: string }) => void;
  removeHeader: (id: string) => void;
  clearHeaders: () => void;
  reset: () => void;
};

const initialState: RequestState = {
  method: 'GET',
  url: '',
  body: '',
  headers: [],
};

export const useRequestStore = create<RequestState & Actions>((set, get) => ({
  ...initialState,

  setMethod: method =>
    set(state => ({
      method,
      body: method === DEFAULT_HTTP_METHOD ? '' : state.body,
    })),
  setUrl: url => set({ url }),
  setBody: body => set({ body }),

  addHeader: init => {
    const id = crypto.randomUUID();
    const newHeader: HttpHeader = {
      id,
      key: init?.key ?? '',
      value: init?.value ?? '',
    };
    set(state => ({ headers: [...state.headers, newHeader] }));
  },

  updateHeaderKey: ({ id, key }) =>
    set(prevState => ({
      headers: prevState.headers.map(header =>
        header.id === id ? { ...header, key } : header
      ),
    })),

  updateHeaderValue: ({ id, value }) => {
    set(state => ({
      headers: state.headers.map(header =>
        header.id === id ? { ...header, value } : header
      ),
    }));
  },

  removeHeader: id =>
    set(state => ({
      headers: state.headers.filter(header => header.id !== id),
    })),

  clearHeaders: () => set({ headers: [] }),

  reset: () => set(initialState),
}));
