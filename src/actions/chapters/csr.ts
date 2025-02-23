import { csrConfig } from '@/apis/action/csr';
import { ChaptersApi } from '@/openapi';

export const csrChaptersApi = new ChaptersApi(csrConfig);
