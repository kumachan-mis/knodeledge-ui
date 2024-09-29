import { ENV_GCP } from '@/utils/env';

import { fetchGoogleAuthHeaderValue, GOOGLE_AUTH_HEADER_NAME } from './auth';

export async function JSON_ROUTE(path: string, method: string, request: Request): Promise<Response> {
  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'application/json');

  if (ENV_GCP) {
    try {
      const googleAuthHeaderValue = await fetchGoogleAuthHeaderValue();
      headers.set(GOOGLE_AUTH_HEADER_NAME, googleAuthHeaderValue);
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
