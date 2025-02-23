import { csrConfig } from '@/apis/action/csr';
import { GraphsApi } from '@/openapi';

export const csrGraphsApi = new GraphsApi(csrConfig);
