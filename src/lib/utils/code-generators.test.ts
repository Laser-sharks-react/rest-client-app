import { describe, it, expect, jest, afterEach } from '@jest/globals';

jest.mock('./headers-array-to-obj', () => ({
  __esModule: true,
  headersArrayToObj: jest.fn((arr: Array<{ key: string; value: string }>) =>
    Object.fromEntries(arr.map(h => [h.key, h.value]))
  ),
}));

import { generateCode } from './code-generators';
import type { Language, RequestState } from '../types/request';

const req: RequestState = {
  url: 'https://api.test/resource',
  method: 'POST',
  body: 'payload',
  headers: [
    { id: 'h1', key: 'Authorization', value: 'Bearer x' },
    { id: 'h2', key: 'X-Id', value: '123' },
  ],
};

describe('generateCode', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('cURL', () => {
    const out = generateCode({ lang: 'cURL', request: req });
    expect(out).toContain('curl -X POST "https://api.test/resource"');
    expect(out).toContain('-H "Authorization: Bearer x"');
    expect(out).toContain('-H "X-Id: 123"');
    expect(out).toContain(`--data 'payload'`);
  });

  it('JavaScript Fetch', () => {
    const out = generateCode({ lang: 'JavaScript Fetch', request: req });
    expect(out).toContain(`fetch("https://api.test/resource", {`);
    expect(out).toContain(`method: "POST"`);
    expect(out).toContain(`"Authorization": "Bearer x"`);
    expect(out).toContain(`"X-Id": "123"`);
    expect(out).toContain(`body: "payload",`);
  });

  it('JavaScript XHR', () => {
    const out = generateCode({ lang: 'JavaScript XHR', request: req });
    expect(out).toContain(`xhr.open("POST", "https://api.test/resource")`);
    expect(out).toContain(`xhr.setRequestHeader("Authorization", "Bearer x");`);
    expect(out).toContain(`xhr.setRequestHeader("X-Id", "123");`);
    expect(out).toContain(`xhr.send("payload");`);
  });

  it('NodeJS (fetch)', () => {
    const out = generateCode({ lang: 'NodeJS', request: req });
    expect(out).toContain(`const fetch = require("node-fetch")`);
    expect(out).toContain(`fetch("https://api.test/resource", {`);
    expect(out).toContain(`method: "POST"`);
    expect(out).toContain(`"Authorization": "Bearer x"`);
    expect(out).toContain(`"X-Id": "123"`);
    expect(out).toContain(`body: "payload",`);
  });

  it('Python (requests)', () => {
    const out = generateCode({ lang: 'Python', request: req });
    expect(out).toContain(`import requests`);
    expect(out).toContain(`url = "https://api.test/resource"`);
    expect(out).toContain(
      `response = requests.request("POST", url, headers=headers, data='payload')`
    );
  });

  it('Java (HttpURLConnection)', () => {
    const out = generateCode({ lang: 'Java', request: req });
    expect(out).toContain(`URL url = new URL("https://api.test/resource");`);
    expect(out).toContain(`conn.setRequestMethod("POST");`);
    expect(out).toContain(
      `conn.setRequestProperty("Authorization", "Bearer x");`
    );
    expect(out).toContain(`conn.setRequestProperty("X-Id", "123");`);
    expect(out).toContain(`conn.setDoOutput(true);`);
    expect(out).toContain(`os.write("payload".getBytes());`);
  });

  it('C# (HttpClient)', () => {
    const out = generateCode({ lang: 'C#', request: req });
    expect(out).toContain(
      `var request = new HttpRequestMessage(HttpMethod.POST, "https://api.test/resource");`
    );
    expect(out).toContain(`request.Headers.Add("Authorization", "Bearer x");`);
    expect(out).toContain(`request.Headers.Add("X-Id", "123");`);
    expect(out).toContain(`request.Content = new StringContent("payload");`);
  });

  it('Go (net/http)', () => {
    const out = generateCode({ lang: 'Go', request: req });
    expect(out).toContain(
      `req, _ := http.NewRequest("POST", "https://api.test/resource", strings.NewReader("payload"))`
    );
    expect(out).toContain(`req.Header.Add("Authorization", "Bearer x")`);
    expect(out).toContain(`req.Header.Add("X-Id", "123")`);
  });

  it('Without body: does not insert fragments of body', () => {
    const noBodyReq = { ...req, body: '' };
    expect(generateCode({ lang: 'cURL', request: noBodyReq })).not.toContain(
      '--data'
    );
    expect(
      generateCode({ lang: 'JavaScript Fetch', request: noBodyReq })
    ).not.toContain('body:');
    expect(generateCode({ lang: 'NodeJS', request: noBodyReq })).not.toContain(
      'body:'
    );
    expect(
      generateCode({ lang: 'JavaScript XHR', request: noBodyReq })
    ).toContain('xhr.send();');
    expect(generateCode({ lang: 'Go', request: noBodyReq })).toContain('nil)');
  });
});
