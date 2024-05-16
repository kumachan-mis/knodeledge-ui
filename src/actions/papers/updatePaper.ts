import { Errorable, fetchFromOpenApi, defaultOnResposeError } from '../openapi';
import {
  PaperUpdateErrorResponse,
  PaperUpdateErrorResponseFromJSON,
  PaperUpdateRequest,
  PaperUpdateResponse,
} from '@/openapi';

import { papersApi } from './api';

export async function updatePaper(
  request: PaperUpdateRequest,
): Promise<Errorable<PaperUpdateResponse, PaperUpdateErrorResponse>> {
  return await fetchFromOpenApi<PaperUpdateResponse, PaperUpdateErrorResponse>(
    async () => await papersApi.papersUpdate({ paperUpdateRequest: request }),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = PaperUpdateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
