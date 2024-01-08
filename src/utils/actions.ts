import { ApplicationErrorResponseFromJSON } from '@/openapi';
import { Configuration, ResponseError } from '@/openapi/runtime';

export const config = new Configuration({ basePath: process.env.NEXT_PUBLIC_APP_URL });

export type Errorable<T extends object> =
  | {
      response: T;
      errorMessage: null;
    }
  | {
      response: null;
      errorMessage: string;
    };

export async function fetchFromOpenApi<T extends object>(rawOpenApi: () => Promise<T>): Promise<Errorable<T>> {
  try {
    const response = await rawOpenApi();
    return { response, errorMessage: null };
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      const errorResponse = ApplicationErrorResponseFromJSON(await error.response.json());
      return { response: null, errorMessage: errorResponse.message };
    }
    return { response: null, errorMessage: 'unknown error' };
  }
}
