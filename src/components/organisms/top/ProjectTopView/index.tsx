import { findProject } from '@/actions/projects/findProject';

import ProjectTopViewComponent from './ProjectTopView';

import { Claims } from '@auth0/nextjs-auth0';

export type ProjectTopViewProps = {
  readonly user: Claims;
  readonly projectId: string;
};

const ProjectTopView: React.FC<ProjectTopViewProps> = async ({ user, projectId }) => {
  const errorable = await findProject({ user: { id: user.sub }, project: { id: projectId } });
  if (errorable.state !== 'success') return null;

  return <ProjectTopViewComponent project={errorable.response.project} />;
};

export default ProjectTopView;
