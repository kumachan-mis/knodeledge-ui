import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { Errorable, defaultOnResposeError } from '@/apis/action/fetch';
import { PaperFindErrorResponse, PaperFindErrorResponseFromJSON, PaperFindRequest, PaperFindResponse } from '@/openapi';

import { csrPapersApi } from './csr';

export async function findPaper(
  request: PaperFindRequest,
): Promise<Errorable<PaperFindResponse, PaperFindErrorResponse>> {
  return await fetchCsrFromOpenApi(
    async (initOverrides) => await csrPapersApi.papersFind({ paperFindRequest: request }, initOverrides),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = PaperFindErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
