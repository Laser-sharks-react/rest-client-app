export function generateCurl(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
  const h = Object.entries(headers)
    .map(([k, v]) => `-H "${k}: ${v}"`)
    .join(' ');
  const data = body ? `--data '${body}'` : '';
  return `curl -X ${method} "${url}" ${h} ${data}`.trim();
}

export function generateFetch(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
  return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},
  ${body ? `body: ${JSON.stringify(body)},` : ''}
});`;
}

export function generateXHR(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
  return `var xhr = new XMLHttpRequest();
xhr.open("${method}", "${url}");
${Object.entries(headers)
  .map(([k, v]) => `xhr.setRequestHeader("${k}", "${v}");`)
  .join('\n')}
xhr.onload = export function() {
  console.log(xhr.responseText);
};
${body ? `xhr.send(${JSON.stringify(body)});` : 'xhr.send();'}`;
}

export function generateNode(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
  return `const fetch = require("node-fetch");

fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},
  ${body ? `body: ${JSON.stringify(body)},` : ''}
})
  .then(res => res.text())
  .then(console.log);`;
}

export function generatePython(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
  return `import requests

url = "${url}"
headers = ${JSON.stringify(headers, null, 2)}
response = requests.request("${method}", url, headers=headers${
    body ? `, data='${body}'` : ''
  })

print(response.text)`;
}

export function generateJava(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
  return `import java.net.*;
import java.io.*;

URL url = new URL("${url}");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("${method}");
${Object.entries(headers)
  .map(([k, v]) => `conn.setRequestProperty("${k}", "${v}");`)
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

export function generateCSharp(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
  return `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.${method}, "${url}");
${Object.entries(headers)
  .map(([k, v]) => `    request.Headers.Add("${k}", "${v}");`)
  .join('\n')}
${body ? `    request.Content = new StringContent("${body}");` : ''}
    var response = await client.SendAsync(request);
    Console.WriteLine(await response.Content.ReadAsStringAsync());
  }
}`;
}

export function generateGo(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
) {
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
${Object.entries(headers)
  .map(([k, v]) => `  req.Header.Add("${k}", "${v}")`)
  .join('\n')}
  res, _ := client.Do(req)
  defer res.Body.Close()
  body, _ := ioutil.ReadAll(res.Body)
  fmt.Println(string(body))
}`;
}
