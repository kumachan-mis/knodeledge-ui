import { config } from '@/apis/action/api';
import { ChaptersApi } from '@/openapi';

export const chaptersApi = new ChaptersApi(config);
