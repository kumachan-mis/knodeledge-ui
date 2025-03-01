import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { ProjectDeleteErrorResponse, ProjectDeleteErrorResponseFromJSON, ProjectDeleteRequest } from '@/openapi';

import { projectsApi } from './api';

export async function deleteProject(
  request: ProjectDeleteRequest,
): Promise<Errorable<object, ProjectDeleteErrorResponse>> {
  return await fetchCsrFromOpenApi<object, ProjectDeleteErrorResponse>(
    async (initOverrides) => {
      await projectsApi.projectsDelete({ projectDeleteRequest: request }, initOverrides);
      return {};
    },
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = ProjectDeleteErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
