import { defaultMethod } from '@/sources/constants';

export async function POST(req: Request) {
  const { url, method, body, headers } = await req.json();

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: method !== defaultMethod ? body : undefined,
    });

    const contentType = res.headers.get('content-type') || '';

    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return Response.json({ status: res.status, ok: res.ok, json: data });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
