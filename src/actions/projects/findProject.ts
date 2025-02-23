import { Errorable, defaultOnResposeError } from '@/apis/action/fetch';
import { fetchSsrFromOpenApi } from '@/apis/action/ssr';
import {
  ProjectFindErrorResponse,
  ProjectFindErrorResponseFromJSON,
  ProjectFindRequest,
  ProjectFindResponse,
} from '@/openapi';

import { ssrProjectsApi } from './ssr';

export async function findProject(
  request: ProjectFindRequest,
): Promise<Errorable<ProjectFindResponse, ProjectFindErrorResponse>> {
  return await fetchSsrFromOpenApi(
    async (initOverrides) => await ssrProjectsApi.projectsFind({ projectFindRequest: request }, initOverrides),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = ProjectFindErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
