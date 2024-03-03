import { Errorable, fetchFromOpenApi } from '@/actions/openapi';
import { ProjectFindRequest, ProjectFindResponse } from '@/openapi';

import { projectsApi } from './api';

export async function findProject(request: ProjectFindRequest): Promise<Errorable<ProjectFindResponse>> {
  return await fetchFromOpenApi(async () => await projectsApi.find({ projectFindRequest: request }));
}
