import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth();

export async function fetchWithGoogleAuth(url: string, options?: RequestInit) {
  const client = await auth.getIdTokenClient(process.env.NEXT_PUBLIC_API_URL ?? '');
  const headers = await client.getRequestHeaders();
  return fetch(url, { ...options, headers: { ...options?.headers, ...headers } });
}
