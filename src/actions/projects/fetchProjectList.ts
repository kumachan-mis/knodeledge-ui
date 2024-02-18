import { Errorable, config, fetchFromOpenApi } from '@/actions/openapi';
import { ProjectListRequest, ProjectListResponse, ProjectsApi } from '@/openapi';

const projectsApi = new ProjectsApi(config);

export async function fetchProjectList(request: ProjectListRequest): Promise<Errorable<ProjectListResponse>> {
  return await fetchFromOpenApi(() => projectsApi.list({ projectListRequest: request }));
}
