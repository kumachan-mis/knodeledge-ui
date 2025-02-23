import { auth0 } from '@/libs/auth0';

export const AUTH0_AUTH_HEADER_NAME = 'Authorization';

export async function fetchAuth0AuthHeaderValue(): Promise<string> {
  const { token } = await auth0.getAccessToken();
  return `Bearer ${token}`;
}
