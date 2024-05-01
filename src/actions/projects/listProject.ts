import { Errorable, fetchFromOpenApi } from '@/actions/openapi';
import { ProjectListRequest, ProjectListResponse } from '@/openapi';

import { projectsApi } from './api';

export async function listProject(request: ProjectListRequest): Promise<Errorable<ProjectListResponse>> {
  return await fetchFromOpenApi(async () => await projectsApi.projectsList({ projectListRequest: request }));
}
