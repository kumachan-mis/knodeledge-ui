import ProjectTopView from '@/components/organisms/top/ProjectTopView';
import { ProjectContextProvider } from '@/contexts/projects';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

export type ProjectDetailPageProps = {
  readonly params: {
    readonly projectId: string;
  };
};

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = async ({ params }) => {
  const session = await getSession();

  return (
    session?.user && (
      <ProjectContextProvider>
        <ProjectTopView projectId={params.projectId} user={session.user} />
      </ProjectContextProvider>
    )
  );
};

export default ProjectDetailPage;
