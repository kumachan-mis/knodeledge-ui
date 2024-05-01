import { Errorable, defaultOnResposeError, fetchFromOpenApi } from '../openapi';
import {
  ChapterListErrorResponse,
  ChapterListErrorResponseFromJSON,
  ChapterListRequest,
  ChapterListResponse,
} from '@/openapi';

import { chaptersApi } from './api';

export function listChapter(
  request: ChapterListRequest,
): Promise<Errorable<ChapterListResponse, ChapterListErrorResponse>> {
  return fetchFromOpenApi(
    async () => await chaptersApi.chaptersList({ chapterListRequest: request }),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = ChapterListErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
