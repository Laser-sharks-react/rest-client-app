import '@testing-library/jest-dom';
import fetch, { Headers, Request, Response } from 'node-fetch';

declare global {
  var fetch: typeof fetch;
  var Headers: typeof Headers;
  var Request: typeof Request;
  var Response: typeof Response;
}

if (!global.fetch) {
  global.fetch = fetch;
  global.Headers = Headers;
  global.Request = Request;
  global.Response = Response;
}
