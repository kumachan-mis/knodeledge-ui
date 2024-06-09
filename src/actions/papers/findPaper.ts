import { Errorable, defaultOnResposeError, fetchFromOpenApi } from '@/actions/openapi';
import { PaperFindErrorResponse, PaperFindErrorResponseFromJSON, PaperFindRequest, PaperFindResponse } from '@/openapi';

import { papersApi } from './api';

export async function findPaper(
  request: PaperFindRequest,
): Promise<Errorable<PaperFindResponse, PaperFindErrorResponse>> {
  return await fetchFromOpenApi(
    async () => await papersApi.papersFind({ paperFindRequest: request }),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = PaperFindErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
