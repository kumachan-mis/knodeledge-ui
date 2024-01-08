import { ApplicationErrorResponseFromJSON } from '@/openapi';
import { Configuration, ResponseError } from '@/openapi/runtime';

export const API_BASE_PATH = 'http://localhost:3000';

export const config = new Configuration({ basePath: API_BASE_PATH });

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
