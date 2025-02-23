import { ApplicationErrorResponse, InitOverrideFunction, ResponseError } from '@/openapi';

import { Errorable, defaultOnResposeError, fetchFromOpenApi } from './api';

export async function fetchCsrFromOpenApi<R extends object, E extends object = ApplicationErrorResponse>(
  onRequest: (initOverrides?: RequestInit | InitOverrideFunction) => Promise<R>,
  onResposeError: (error: ResponseError) => Promise<Errorable<R, E>> = defaultOnResposeError,
): Promise<Errorable<R, E>> {
  return await fetchFromOpenApi(onRequest, onResposeError);
}
