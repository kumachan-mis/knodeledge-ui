import { Errorable, fetchFromOpenApi, defaultOnResposeError } from '../openapi';
import {
  ChapterCreateRequest,
  ChapterCreateResponse,
  ChapterCreateErrorResponse,
  ChapterCreateErrorResponseFromJSON,
} from '@/openapi';

import { chaptersApi } from './api';

export async function createChapter(
  request: ChapterCreateRequest,
): Promise<Errorable<ChapterCreateResponse, ChapterCreateErrorResponse>> {
  return await fetchFromOpenApi<ChapterCreateResponse, ChapterCreateErrorResponse>(
    async () => await chaptersApi.chaptersCreate({ chapterCreateRequest: request }),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ChapterCreateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
