import { Errorable, fetchFromOpenApi, defaultOnResposeError } from '../openapi';
import {
  ProjectUpdateErrorResponse,
  ProjectUpdateErrorResponseFromJSON,
  ProjectUpdateRequest,
  ProjectUpdateResponse,
} from '@/openapi';

import { projectsApi } from './api';

export async function updateProject(
  request: ProjectUpdateRequest,
): Promise<Errorable<ProjectUpdateResponse, ProjectUpdateErrorResponse>> {
  return await fetchFromOpenApi<ProjectUpdateResponse, ProjectUpdateErrorResponse>(
    async () => await projectsApi.projectsUpdate({ projectUpdateRequest: request }),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ProjectUpdateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
