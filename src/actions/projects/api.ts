import { config } from '@/apis/action/api';
import { ProjectsApi } from '@/openapi';

export const projectsApi = new ProjectsApi(config);
