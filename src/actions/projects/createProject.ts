import { Errorable, defaultOnResposeError, fetchFromOpenApi } from '@/actions/openapi';
import {
  ProjectCreateErrorResponse,
  ProjectCreateErrorResponseFromJSON,
  ProjectCreateRequest,
  ProjectCreateResponse,
} from '@/openapi';

import { projectsApi } from './api';

export async function createProject(
  request: ProjectCreateRequest,
): Promise<Errorable<ProjectCreateResponse, ProjectCreateErrorResponse>> {
  return await fetchFromOpenApi<ProjectCreateResponse, ProjectCreateErrorResponse>(
    async () => await projectsApi.create({ projectCreateRequest: request }),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ProjectCreateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
