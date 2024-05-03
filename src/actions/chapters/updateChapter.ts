import { Errorable, fetchFromOpenApi, defaultOnResposeError } from '../openapi';
import {
  ChapterUpdateRequest,
  ChapterUpdateResponse,
  ChapterUpdateErrorResponse,
  ChapterUpdateErrorResponseFromJSON,
} from '@/openapi';

import { chaptersApi } from './api';

export function updateChapter(
  request: ChapterUpdateRequest,
): Promise<Errorable<ChapterUpdateResponse, ChapterUpdateErrorResponse>> {
  return fetchFromOpenApi<ChapterUpdateResponse, ChapterUpdateErrorResponse>(
    async () => await chaptersApi.chaptersUpdate({ chapterUpdateRequest: request }),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ChapterUpdateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
