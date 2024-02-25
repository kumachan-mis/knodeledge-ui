import { config } from '../openapi';
import { ProjectsApi } from '@/openapi';

export const projectsApi = new ProjectsApi(config);
