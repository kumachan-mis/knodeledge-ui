import { ssrConfig } from '@/apis/action/ssr';
import { ProjectsApi } from '@/openapi';

export const ssrProjectsApi = new ProjectsApi(ssrConfig);
