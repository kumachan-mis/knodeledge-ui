import { csrConfig } from '@/apis/action/csr';
import { ProjectsApi } from '@/openapi';

export const csrProjectsApi = new ProjectsApi(csrConfig);
