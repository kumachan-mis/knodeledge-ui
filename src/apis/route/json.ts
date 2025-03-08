import { fetchAuth0AuthHeaderValue, AUTH0_AUTH_HEADER_NAME } from '../auth/auth0';
import { fetchGoogleAuthHeaderValue, GOOGLE_AUTH_HEADER_NAME } from '../auth/google';
import { ENV_GCP } from '@/utils/env';

export function createJsonRoute(
  path: string,
  method: string,
  jsonHeaders: (init?: HeadersInit) => Promise<Headers>,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    const headers = await jsonHeaders(request.headers);

    if (ENV_GCP) {
      try {
        const googleAuthHeaderValue = await fetchGoogleAuthHeaderValue();
        headers.set(GOOGLE_AUTH_HEADER_NAME, googleAuthHeaderValue);
      } catch (e) {
        console.warn(e);
      }
    }

    try {
      const body = JSON.stringify(await request.json());
      return await fetch(`${process.env.API_URL}${path}`, { method, headers, body });
    } catch (e) {
      console.warn(e);
      return Response.json({ message: 'connection error' }, { status: 500 });
    }
  };
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function jsonSsrHeaders(init?: HeadersInit): Promise<Headers> {
  const headers = new Headers(init);

  headers.set('Content-Type', 'application/json');

  return headers;
}

export async function jsonCsrHeaders(init?: HeadersInit): Promise<Headers> {
  const headers = new Headers(init);

  headers.set('Content-Type', 'application/json');

  try {
    const auth0AuthHeaderValue = await fetchAuth0AuthHeaderValue();
    headers.set(AUTH0_AUTH_HEADER_NAME, auth0AuthHeaderValue);
  } catch (e) {
    console.warn(e);
  }

  return headers;
}
