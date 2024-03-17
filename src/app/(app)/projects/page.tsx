import ProjectCardList from '@/components/organisms/list/ProjectCardList';
import ProjectTitle from '@/components/organisms/list/ProjectTitle';
import ProjectToolbar from '@/components/organisms/list/ProjectToolbar';
import { ProjectListContextProvider, useInitProjectList } from '@/contexts/projects';
import { AuthorizedPageProps } from '@/utils/page';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

const ProjectListPage: NextPage = async () => {
  const session = await getSession();
  return session?.user && <AuthorizedProjectListPage user={session.user} />;
};

const AuthorizedProjectListPage: NextPage<AuthorizedPageProps> = ({ user }) => {
  useInitProjectList({ id: user.sub });

  return (
    <ProjectListContextProvider>
      <ProjectTitle>PROJECTS</ProjectTitle>
      <ProjectToolbar user={user} />
      <ProjectCardList />
    </ProjectListContextProvider>
  );
};

export default ProjectListPage;
