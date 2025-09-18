export type RequestState = {
  url: string;
  method: HttpMethod;
  body: string;
  headers: HttpHeader[];
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpHeader {
  id: string;
  key: string;
  value: string;
}

export type Language =
  | 'cURL'
  | 'JavaScript Fetch'
  | 'JavaScript XHR'
  | 'NodeJS'
  | 'Python'
  | 'Java'
  | 'C#'
  | 'Go';

export interface RequestRecord {
  id: string;
  uid: string;
  endpoint: string;
  method: HttpMethod | null;
  status: number | null;
  latencyMs: number | null;
  reqBytes: number;
  resBytes: number;
  error: string | null;
  time: number;
  restore: {
    url: string;
    method: HttpMethod | null;
    headers: HttpHeader[] | null;
    body: string;
  };
}

export type RequestParams = Omit<RequestRecord, 'id'>;
export type RequestSuccessParams = Omit<RequestParams, 'error'>;
export type RequestErrorParams = {
  uid: RequestRecord['uid'];
  error: string;
} & Partial<Omit<RequestParams, 'uid' | 'error' | 'restore'>> & {
    restore?: Partial<RequestRecord['restore']>;
  };
