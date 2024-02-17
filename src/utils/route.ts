import { ENV_GCP } from './env';

import { GoogleAuth } from 'google-auth-library';

const IDTOKEN_TARGET_AUDIENCE = process.env.API_URL ?? '';
const IDTOKEN_AUTH_HEADER = 'X-Serverless-Authorization';

const googleAuth = new GoogleAuth();

export type RouteHandler = (request: Request) => Promise<Response>;

export async function JSON_ROUTE(path: string, method: string, request: Request): Promise<Response> {
  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'application/json');

  if (ENV_GCP) {
    try {
      const idTokenAuthHeaderValue = await fetchIdtokenAuthHeader();
      headers.set(IDTOKEN_AUTH_HEADER, idTokenAuthHeaderValue);
    } catch (e) {
      console.warn(e);
      return Response.json({ message: 'forbidden' }, { status: 403 });
    }
  }

  try {
    const res = await fetch(`${process.env.API_URL}${path}`, {
      method,
      headers,
      body: JSON.stringify(await request.json()),
    });
    return Response.json(await res.json(), { status: res.status });
  } catch (e) {
    console.warn(e);
    return Response.json({ message: 'connection error' }, { status: 500 });
  }
}

async function fetchIdtokenAuthHeader(): Promise<string> {
  const client = await googleAuth.getIdTokenClient(IDTOKEN_TARGET_AUDIENCE);
  const clientHeaders = await client.getRequestHeaders();
  return clientHeaders.Authorization;
}
