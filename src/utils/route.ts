import { ENVIRONMENT } from './env';

import { GoogleAuth } from 'google-auth-library';

const IDTOKEN_TARGET_AUDIENCE = process.env.API_URL ?? '';
const IDTOKEN_AUTH_HEADER = 'X-Serverless-Authorization';
const IDTOKEN_AUTH_REQUIRED = ['production', 'staging'].includes(ENVIRONMENT);

const googleAuth = new GoogleAuth();

export async function JSON_POST(path: string, request: Request): Promise<Response> {
  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'application/json');

  if (IDTOKEN_AUTH_REQUIRED) {
    try {
      const idTokenAuthHeaderValue = await fetchIdtokenAuthHeader();
      headers.set(IDTOKEN_AUTH_HEADER, idTokenAuthHeaderValue);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
      return Response.json({ message: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    const res = await fetch(`${process.env.API_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(await request.json()),
    });
    return Response.json(await res.json(), { status: res.status });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

async function fetchIdtokenAuthHeader(): Promise<string> {
  const client = await googleAuth.getIdTokenClient(IDTOKEN_TARGET_AUDIENCE);
  const clientHeaders = await client.getRequestHeaders();
  return clientHeaders.Authorization;
}
