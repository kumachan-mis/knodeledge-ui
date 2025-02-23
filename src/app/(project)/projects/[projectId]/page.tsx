import { listChapter } from '@/actions/chapters/listChapter';
import { findProject } from '@/actions/projects/findProject';
import ProjectLayout from '@/components/layouts/ProjectLayout';
import ChapterList from '@/components/organisms/ChapterList';
import ChapterListHeader from '@/components/organisms/ChapterListHeader';
import InternalError from '@/components/organisms/InternalError';
import NotFoundError from '@/components/organisms/NotFoundError';
import UnauthorizedError from '@/components/organisms/UnauthorizedError';
import { ChapterListContextProvider } from '@/contexts/openapi/chapters';
import { CachedGraphContextProvider } from '@/contexts/openapi/graphs';
import { CachedPaperContextProvider } from '@/contexts/openapi/papers';
import { ProjectContextProvider } from '@/contexts/openapi/projects';
import { auth0 } from '@/libs/auth0';

import ProjectDetailPageContent from './content';

import { NextPage } from 'next';

export type ProjectDetailPageProps = {
  readonly params: Promise<{
    readonly projectId: string;
  }>;
};

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = async (props) => {
  const session = await auth0.getSession();
  const params = await props.params;

  if (!session) {
    return (
      <ProjectDetailPageLayout params={params}>
        <UnauthorizedError />
      </ProjectDetailPageLayout>
    );
  }

  const errorableProject = await findProject({
    user: { id: session.user.sub },
    project: { id: params.projectId },
  });

  if (errorableProject.state === 'panic') {
    return (
      <ProjectDetailPageLayout params={params}>
        <InternalError />
      </ProjectDetailPageLayout>
    );
  }

  if (errorableProject.state === 'error') {
    return (
      <ProjectDetailPageLayout params={params}>
        <NotFoundError />
      </ProjectDetailPageLayout>
    );
  }

  const errorableChapterList = await listChapter({
    user: { id: session.user.sub },
    project: { id: params.projectId },
  });

  if (errorableChapterList.state !== 'success') {
    return (
      <ProjectDetailPageLayout params={params}>
        <InternalError />
      </ProjectDetailPageLayout>
    );
  }

  return (
    <ProjectContextProvider initialProject={errorableProject.response.project}>
      <ChapterListContextProvider initialChapterList={errorableChapterList.response.chapters}>
        <CachedPaperContextProvider>
          <CachedGraphContextProvider>
            <ProjectDetailPageLayout params={params}>
              <ProjectDetailPageContent user={session.user} params={params} />
            </ProjectDetailPageLayout>
          </CachedGraphContextProvider>
        </CachedPaperContextProvider>
      </ChapterListContextProvider>
    </ProjectContextProvider>
  );
};

export type ProjectDetailPageLayoutProps = {
  readonly params: {
    readonly projectId: string;
  };
  readonly children?: React.ReactNode;
};

const ProjectDetailPageLayout: React.FC<ProjectDetailPageLayoutProps> = ({ children, params: { projectId } }) => (
  <ProjectLayout DrawerContent={ChapterList} DrawerHeader={ChapterListHeader} projectId={projectId}>
    {children}
  </ProjectLayout>
);

export default ProjectDetailPage;
