import { Errorable } from '@/apis/action/fetch';
import { fetchSsrFromOpenApi } from '@/apis/action/ssr';
import { ProjectListRequest, ProjectListResponse } from '@/openapi';

import { ssrProjectsApi } from './ssr';

export async function listProject(request: ProjectListRequest): Promise<Errorable<ProjectListResponse>> {
  return await fetchSsrFromOpenApi(
    async (initOverrides) => await ssrProjectsApi.projectsList({ projectListRequest: request }, initOverrides),
  );
}
