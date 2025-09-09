import { type HttpHeader, type HttpMethod } from '@/sources/types';
import { create } from 'zustand';

export interface State {
  method: HttpMethod;
  url: string;
  body: string;
  headers: HttpHeader[];
}

interface Store extends State {
  setMethod: (m: HttpMethod) => void;
  setUrl: (u: string) => void;
  setBody: (b: string) => void;

  addHeader: (init?: Partial<HttpHeader>) => void;
  updateHeader: (id: string, field: 'key' | 'value', value: string) => void;
  removeHeader: (id: string) => void;
  clearHeaders: () => void;

  reset: () => void;
}

const initialState: State = {
  method: 'GET',
  url: '',
  body: '',
  headers: [],
};

export const useRequestStore = create<Store>(set => ({
  ...initialState,

  setMethod: method => set({ method }),
  setUrl: url => set({ url }),
  setBody: body => set({ body }),

  addHeader: init => {
    const id = crypto.randomUUID();
    const h: HttpHeader = {
      id,
      key: init?.key ?? '',
      value: init?.value ?? '',
    };
    set(s => ({ headers: [...s.headers, h] }));
  },

  updateHeader: (id, field, value) =>
    set(s => ({
      headers: s.headers.map(h => (h.id === id ? { ...h, [field]: value } : h)),
    })),

  removeHeader: id =>
    set(s => ({ headers: s.headers.filter(h => h.id !== id) })),

  clearHeaders: () => set({ headers: [] }),

  reset: () => set(initialState),
}));
