import ProjectTopView from '@/components/organisms/top/ProjectTopView';
import { ProjectContextProvider, useInitProject } from '@/contexts/projects';
import { AuthorizedPageProps } from '@/utils/page';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

export type ProjectDetailPageProps = {
  readonly params: {
    readonly projectId: string;
  };
};

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = async (props) => {
  const session = await getSession();
  return session?.user && <AuthorizedProjectDetailPage user={session.user} {...props} />;
};

const AuthorizedProjectDetailPage: NextPage<AuthorizedPageProps<ProjectDetailPageProps>> = ({ user, params }) => {
  useInitProject({ id: user.sub }, params.projectId);

  return (
    <ProjectContextProvider>
      <ProjectTopView />
    </ProjectContextProvider>
  );
};

export default ProjectDetailPage;
