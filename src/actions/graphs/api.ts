import { config } from '@/apis/action/api';
import { GraphsApi } from '@/openapi';

export const graphsApi = new GraphsApi(config);
