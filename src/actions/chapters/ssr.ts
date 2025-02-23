import { ssrConfig } from '@/apis/action/ssr';
import { ChaptersApi } from '@/openapi';

export const ssrChaptersApi = new ChaptersApi(ssrConfig);
