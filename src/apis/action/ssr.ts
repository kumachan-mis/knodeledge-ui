import { AUTH0_AUTH_HEADER_NAME, fetchAuth0AuthHeaderValue } from '../auth/auth0';
import { ApplicationErrorResponse, InitOverrideFunction, ResponseError } from '@/openapi';

import { Errorable, defaultOnResposeError, fetchFromOpenApi } from './api';

export async function fetchSsrFromOpenApi<R extends object, E extends object = ApplicationErrorResponse>(
  onRequest: (initOverrides?: RequestInit | InitOverrideFunction) => Promise<R>,
  onResposeError: (error: ResponseError) => Promise<Errorable<R, E>> = defaultOnResposeError,
): Promise<Errorable<R, E>> {
  return await fetchFromOpenApi(() => onRequest(initOverrides), onResposeError);
}

async function initOverrides(): Promise<RequestInit> {
  const headers = new Headers();

  const auth0AuthHeaderValue = await fetchAuth0AuthHeaderValue();
  headers.set(AUTH0_AUTH_HEADER_NAME, auth0AuthHeaderValue);

  return { headers };
}
