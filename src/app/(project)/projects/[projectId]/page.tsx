import { listChapter } from '@/actions/chapters/listChapter';
import { findProject } from '@/actions/projects/findProject';
import ProjectLayout from '@/components/layouts/ProjectLayout';
import ChapterList from '@/components/organisms/ChapterList';
import ChapterListHeader from '@/components/organisms/ChapterListHeader';
import InternalError from '@/components/organisms/InternalError';
import NotFoundError from '@/components/organisms/NotFoundError';
import UnauthorizedError from '@/components/organisms/UnauthorizedError';
import { ChapterListContextProvider } from '@/contexts/chapters';
import { CachedGraphContextProvider } from '@/contexts/graphs';
import { CachedPaperContextProvider } from '@/contexts/papers';
import { ProjectContextProvider } from '@/contexts/projects';

import ProjectDetailPageClient from './client';

import { getSession } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';

export type ProjectDetailPageProps = {
  readonly params: {
    readonly projectId: string;
  };
};

const ProjectDetailPage: NextPage<ProjectDetailPageProps> = async (props) => {
  const session = await getSession();
  if (!session) {
    return (
      <ProjectDetailPageLayout {...props}>
        <UnauthorizedError />
      </ProjectDetailPageLayout>
    );
  }

  const errorableProject = await findProject({
    user: { id: session.user.sub },
    project: { id: props.params.projectId },
  });

  if (errorableProject.state === 'panic') {
    return (
      <ProjectDetailPageLayout {...props}>
        <InternalError />
      </ProjectDetailPageLayout>
    );
  }

  if (errorableProject.state === 'error') {
    return (
      <ProjectDetailPageLayout {...props}>
        <NotFoundError />
      </ProjectDetailPageLayout>
    );
  }

  const errorableChapterList = await listChapter({
    user: { id: session.user.sub },
    project: { id: props.params.projectId },
  });

  if (errorableChapterList.state !== 'success') {
    return (
      <ProjectDetailPageLayout {...props}>
        <InternalError />
      </ProjectDetailPageLayout>
    );
  }

  return (
    <ProjectContextProvider initialProject={errorableProject.response.project}>
      <ChapterListContextProvider initialChapterList={errorableChapterList.response.chapters}>
        <CachedPaperContextProvider>
          <CachedGraphContextProvider>
            <ProjectDetailPageLayout {...props}>
              <ProjectDetailPageClient user={session.user} {...props} />
            </ProjectDetailPageLayout>
          </CachedGraphContextProvider>
        </CachedPaperContextProvider>
      </ChapterListContextProvider>
    </ProjectContextProvider>
  );
};

const ProjectDetailPageLayout: React.FC<ProjectDetailPageProps & { readonly children?: React.ReactNode }> = ({
  children,
  params: { projectId },
}) => (
  <ProjectLayout DrawerContent={ChapterList} DrawerHeader={ChapterListHeader} projectId={projectId}>
    {children}
  </ProjectLayout>
);

export default ProjectDetailPage;
