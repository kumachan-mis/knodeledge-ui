import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchSsrFromOpenApi } from '@/apis/action/ssr';
import {
  ProjectFindErrorResponse,
  ProjectFindErrorResponseFromJSON,
  ProjectFindRequest,
  ProjectFindResponse,
} from '@/openapi';

import { projectsApi } from './api';

export async function findProject(
  request: ProjectFindRequest,
): Promise<Errorable<ProjectFindResponse, ProjectFindErrorResponse>> {
  return await fetchSsrFromOpenApi(
    async (initOverrides) => await projectsApi.projectsFind(request, initOverrides),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = ProjectFindErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
