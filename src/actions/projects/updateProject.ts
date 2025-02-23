import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { Errorable, defaultOnResposeError } from '@/apis/action/fetch';
import {
  ProjectUpdateErrorResponse,
  ProjectUpdateErrorResponseFromJSON,
  ProjectUpdateRequest,
  ProjectUpdateResponse,
} from '@/openapi';

import { csrProjectsApi } from './csr';

export async function updateProject(
  request: ProjectUpdateRequest,
): Promise<Errorable<ProjectUpdateResponse, ProjectUpdateErrorResponse>> {
  return await fetchCsrFromOpenApi<ProjectUpdateResponse, ProjectUpdateErrorResponse>(
    async (initOverrides) => await csrProjectsApi.projectsUpdate({ projectUpdateRequest: request }, initOverrides),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ProjectUpdateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
