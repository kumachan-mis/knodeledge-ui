import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { ChapterDeleteErrorResponse, ChapterDeleteErrorResponseFromJSON, ChapterDeleteRequest } from '@/openapi';

import { chaptersApi } from './api';

export async function deleteChapter(
  request: ChapterDeleteRequest,
): Promise<Errorable<object, ChapterDeleteErrorResponse>> {
  return await fetchCsrFromOpenApi<object, ChapterDeleteErrorResponse>(
    async (initOverrides) => {
      await chaptersApi.chaptersDelete({ chapterDeleteRequest: request }, initOverrides);
      return {};
    },
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ChapterDeleteErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
