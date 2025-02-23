import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { Errorable, defaultOnResposeError } from '@/apis/action/fetch';
import {
  ChapterUpdateRequest,
  ChapterUpdateResponse,
  ChapterUpdateErrorResponse,
  ChapterUpdateErrorResponseFromJSON,
} from '@/openapi';

import { csrChaptersApi } from './csr';

export function updateChapter(
  request: ChapterUpdateRequest,
): Promise<Errorable<ChapterUpdateResponse, ChapterUpdateErrorResponse>> {
  return fetchCsrFromOpenApi<ChapterUpdateResponse, ChapterUpdateErrorResponse>(
    async (initOverrides) => await csrChaptersApi.chaptersUpdate({ chapterUpdateRequest: request }, initOverrides),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ChapterUpdateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
