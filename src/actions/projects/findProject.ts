import { Errorable, defaultOnResposeError, fetchFromOpenApi } from '@/actions/openapi';
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
  return await fetchFromOpenApi(
    async () => await projectsApi.find({ projectFindRequest: request }),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = ProjectFindErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
