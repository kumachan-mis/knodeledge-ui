import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { PaperFindErrorResponse, PaperFindErrorResponseFromJSON, PaperFindRequest, PaperFindResponse } from '@/openapi';

import { papersApi } from './api';

export async function findPaper(
  request: PaperFindRequest,
): Promise<Errorable<PaperFindResponse, PaperFindErrorResponse>> {
  return await fetchCsrFromOpenApi(
    async (initOverrides) => await papersApi.papersFind(request, initOverrides),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = PaperFindErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
