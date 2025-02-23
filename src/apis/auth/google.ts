import { GoogleAuth } from 'google-auth-library';

export const googleAuth = new GoogleAuth();

const GOOGLE_AUTH_TARGET_AUDIENCE = process.env.API_URL ?? '';

export const GOOGLE_AUTH_HEADER_NAME = 'X-Serverless-Authorization';

export async function fetchGoogleAuthHeaderValue(): Promise<string> {
  const client = await googleAuth.getIdTokenClient(GOOGLE_AUTH_TARGET_AUDIENCE);
  const clientHeaders = await client.getRequestHeaders();
  return clientHeaders.Authorization;
}
