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
