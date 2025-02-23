import { config } from '@/apis/action/api';
import { PapersApi } from '@/openapi';

export const papersApi = new PapersApi(config);
