import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { Errorable, defaultOnResposeError } from '@/apis/action/fetch';
import {
  ChapterCreateRequest,
  ChapterCreateResponse,
  ChapterCreateErrorResponse,
  ChapterCreateErrorResponseFromJSON,
} from '@/openapi';

import { csrChaptersApi } from './csr';

export async function createChapter(
  request: ChapterCreateRequest,
): Promise<Errorable<ChapterCreateResponse, ChapterCreateErrorResponse>> {
  return await fetchCsrFromOpenApi<ChapterCreateResponse, ChapterCreateErrorResponse>(
    async (initOverrides) => await csrChaptersApi.chaptersCreate({ chapterCreateRequest: request }, initOverrides),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ChapterCreateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
