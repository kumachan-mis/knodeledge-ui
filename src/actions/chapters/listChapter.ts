import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchSsrFromOpenApi } from '@/apis/action/ssr';
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
  return fetchSsrFromOpenApi(
    async (initOverrides) => await chaptersApi.chaptersList(request, initOverrides),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = ChapterListErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
