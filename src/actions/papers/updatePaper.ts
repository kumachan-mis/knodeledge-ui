import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { Errorable, defaultOnResposeError } from '@/apis/action/fetch';
import {
  PaperUpdateErrorResponse,
  PaperUpdateErrorResponseFromJSON,
  PaperUpdateRequest,
  PaperUpdateResponse,
} from '@/openapi';

import { csrPapersApi } from './csr';

export async function updatePaper(
  request: PaperUpdateRequest,
): Promise<Errorable<PaperUpdateResponse, PaperUpdateErrorResponse>> {
  return await fetchCsrFromOpenApi<PaperUpdateResponse, PaperUpdateErrorResponse>(
    async (initOverrides) => await csrPapersApi.papersUpdate({ paperUpdateRequest: request }, initOverrides),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = PaperUpdateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
