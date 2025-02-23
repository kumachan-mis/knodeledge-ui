import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchCsrFromOpenApi } from '@/apis/action/csr';
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
  return await fetchCsrFromOpenApi<ProjectCreateResponse, ProjectCreateErrorResponse>(
    async (initOverrides) => await projectsApi.projectsCreate({ projectCreateRequest: request }, initOverrides),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ProjectCreateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
