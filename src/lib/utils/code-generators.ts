import type { Language, RequestState } from '@/lib/types/request';
import { headersArrayToObj } from './headers-array-to-obj';

export function generateCode({
  lang,
  request,
}: {
  lang: Language;
  request: RequestState;
}) {
  switch (lang) {
    case 'cURL':
      return generateCurl(request);
    case 'JavaScript Fetch':
      return generateFetch(request);
    case 'JavaScript XHR':
      return generateXHR(request);
    case 'NodeJS':
      return generateNode(request);
    case 'Python':
      return generatePython(request);
    case 'Java':
      return generateJava(request);
    case 'C#':
      return generateCSharp(request);
    case 'Go':
      return generateGo(request);
    default:
      return '// Unsupported language';
  }
}

function generateCurl({ url, method, headers, body }: RequestState) {
  const h = headers.map(({ key, value }) => `-H "${key}: ${value}"`).join(' ');
  const data = body ? `--data '${body}'` : '';
  return `curl -X ${method} "${url}" ${h} ${data}`.trim();
}

function generateFetch({ url, method, headers, body }: RequestState) {
  return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headersArrayToObj(headers), null, 2)},
  ${body ? `body: ${JSON.stringify(body)},` : ''}
});`;
}

function generateXHR({ url, method, headers, body }: RequestState) {
  return `var xhr = new XMLHttpRequest();
xhr.open("${method}", "${url}");
${headers
  .map(({ key, value }) => `xhr.setRequestHeader("${key}", "${value}");`)
  .join('\n')}
xhr.onload = export function() {
  console.log(xhr.responseText);
};
${body ? `xhr.send(${JSON.stringify(body)});` : 'xhr.send();'}`;
}

function generateNode({ url, method, headers, body }: RequestState) {
  return `const fetch = require("node-fetch");

fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headersArrayToObj(headers), null, 2)},
  ${body ? `body: ${JSON.stringify(body)},` : ''}
})
  .then(res => res.text())
  .then(console.log);`;
}

function generatePython({ url, method, headers, body }: RequestState) {
  return `import requests

url = "${url}"
headers = ${JSON.stringify(headersArrayToObj(headers), null, 2)}
response = requests.request("${method}", url, headers=headers${
    body ? `, data='${body}'` : ''
  })

print(response.text)`;
}

function generateJava({ url, method, headers, body }: RequestState) {
  return `import java.net.*;
import java.io.*;

URL url = new URL("${url}");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("${method}");
${headers
  .map(({ key, value }) => `conn.setRequestProperty("${key}", "${value}");`)
  .join('\n')}
${body ? 'conn.setDoOutput(true);\ntry(OutputStream os = conn.getOutputStream()) { os.write("'.concat(body, '".getBytes()); }') : ''}

BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
  response.append(inputLine);
}
in.close();

System.out.println(response.toString());`;
}

function generateCSharp({ url, method, headers, body }: RequestState) {
  return `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.${method}, "${url}");
${headers
  .map(({ key, value }) => `    request.Headers.Add("${key}", "${value}");`)
  .join('\n')}
${body ? `    request.Content = new StringContent("${body}");` : ''}
    var response = await client.SendAsync(request);
    Console.WriteLine(await response.Content.ReadAsStringAsync());
  }
}`;
}

function generateGo({ url, method, headers, body }: RequestState) {
  return `package main

import (
  "fmt"
  "io/ioutil"
  "net/http"
  "strings"
)

func main() {
  client := &http.Client{}
  req, _ := http.NewRequest("${method}", "${url}", ${
    body ? `strings.NewReader("${body}")` : 'nil'
  })
${headers
  .map(({ key, value }) => `  req.Header.Add("${key}", "${value}")`)
  .join('\n')}
  res, _ := client.Do(req)
  defer res.Body.Close()
  body, _ := ioutil.ReadAll(res.Body)
  fmt.Println(string(body))
}`;
}
