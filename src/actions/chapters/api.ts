import { config } from '../openapi';
import { ChaptersApi } from '@/openapi';

export const chaptersApi = new ChaptersApi(config);
