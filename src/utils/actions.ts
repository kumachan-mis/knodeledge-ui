import { ApplicationErrorResponse, ApplicationErrorResponseFromJSON } from '@/openapi';
import { Configuration, ResponseError } from '@/openapi/runtime';

export const config = new Configuration({ basePath: process.env.APP_URL });

export type Errorable<R extends object, E extends object = ApplicationErrorResponse> =
  | {
      state: 'success';
      response: R;
      error: null;
    }
  | {
      state: 'error';
      response: null;
      error: E;
    }
  | {
      state: 'panic';
      response: null;
      error: ApplicationErrorResponse;
    };

export async function fetchFromOpenApi<R extends object, E extends object = ApplicationErrorResponse>(
  onRequest: () => Promise<R>,
  onResposeError?: (error: ResponseError) => Errorable<R, E>,
): Promise<Errorable<R, E>> {
  try {
    const response = await onRequest();
    return { state: 'success', response, error: null };
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      if (onResposeError) return onResposeError(error);

      const errorResponse = ApplicationErrorResponseFromJSON(error.response.json());
      return { state: 'panic', response: null, error: errorResponse };
    }

    const errorResponse = ApplicationErrorResponseFromJSON({ message: 'unknown error' });
    return { state: 'panic', response: null, error: errorResponse };
  }
}
