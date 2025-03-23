import { Errorable } from '@/apis/action/api';
import { fetchSsrFromOpenApi } from '@/apis/action/ssr';
import { ProjectListRequest, ProjectListResponse } from '@/openapi';

import { projectsApi } from './api';

export async function listProject(request: ProjectListRequest): Promise<Errorable<ProjectListResponse>> {
  return await fetchSsrFromOpenApi(async (initOverrides) => await projectsApi.projectsList(request, initOverrides));
}
