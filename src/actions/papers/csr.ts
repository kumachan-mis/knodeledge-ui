import { csrConfig } from '@/apis/action/csr';
import { PapersApi } from '@/openapi';

export const csrPapersApi = new PapersApi(csrConfig);
