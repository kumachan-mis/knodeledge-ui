import { GoogleAuth } from 'google-auth-library';

const TARGET_AUDIENCE = process.env.NEXT_PUBLIC_API_URL ?? '';
const GOOGLE_AUTH_HEADER = 'X-Serverless-Authorization';

const auth = new GoogleAuth();

export async function fetchWithGoogleAuth(url: string, options?: RequestInit) {
  const client = await auth.getIdTokenClient(TARGET_AUDIENCE);
  const idToken = await client.idTokenProvider.fetchIdToken(TARGET_AUDIENCE);
  return fetch(url, { ...options, headers: { ...options?.headers, [GOOGLE_AUTH_HEADER]: `Bearer ${idToken}` } });
}
