import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { Errorable, defaultOnResposeError } from '@/apis/action/fetch';
import {
  ProjectCreateErrorResponse,
  ProjectCreateErrorResponseFromJSON,
  ProjectCreateRequest,
  ProjectCreateResponse,
} from '@/openapi';

import { csrProjectsApi } from './csr';

export async function createProject(
  request: ProjectCreateRequest,
): Promise<Errorable<ProjectCreateResponse, ProjectCreateErrorResponse>> {
  return await fetchCsrFromOpenApi<ProjectCreateResponse, ProjectCreateErrorResponse>(
    async (initOverrides) => await csrProjectsApi.projectsCreate({ projectCreateRequest: request }, initOverrides),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ProjectCreateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
