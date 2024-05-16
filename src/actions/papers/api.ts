import { config } from '../openapi';
import { PapersApi } from '@/openapi';

export const papersApi = new PapersApi(config);
