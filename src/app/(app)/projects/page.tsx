import { listProject } from '@/actions/projects/listProject';
import AppLayout from '@/components/layouts/AppLayout';
import InternalError from '@/components/organisms/InternalError';
import UnauthorizedError from '@/components/organisms/UnauthorizedError';
import { ProjectListContextProvider } from '@/contexts/openapi/projects';
import { auth0 } from '@/libs/auth0';

import ProjectListPageContent from './content';

import { NextPage } from 'next';

const ProjectListPage: NextPage = async () => {
  const session = await auth0.getSession();
  if (!session) {
    return (
      <AppLayout>
        <UnauthorizedError />
      </AppLayout>
    );
  }

  const errorableProjectList = await listProject({ user: { id: session.user.sub } });

  if (errorableProjectList.state !== 'success') {
    return (
      <AppLayout>
        <InternalError />
      </AppLayout>
    );
  }

  return (
    <ProjectListContextProvider initialProjectList={errorableProjectList.response.projects}>
      <AppLayout>
        <ProjectListPageContent user={session.user} />;
      </AppLayout>
    </ProjectListContextProvider>
  );
};

export default ProjectListPage;
