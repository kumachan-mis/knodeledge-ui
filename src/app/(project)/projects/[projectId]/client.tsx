'use client';
import ChapterView from '@/components/organisms/ChapterView';
import NotFoundError from '@/components/organisms/NotFoundError';
import ProjectView from '@/components/organisms/ProjectView';
import SectionView from '@/components/organisms/SectionView';
import { useInitChapterList, useLoadableChapterInList, useLoadableSectionInChapter } from '@/contexts/chapters';
import { useInitGraph } from '@/contexts/graphs';
import { useInitPaper } from '@/contexts/papers';
import { useInitProject, useLoadableProject } from '@/contexts/projects';
import { AuthorizedPageProps } from '@/utils/page';
import { CHAPTER_ID_PARAM_KEY, SECTION_ID_PARAM_KEY } from '@/utils/params';

import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';

export type ProjectDetailPageClientProps = {
  readonly params: {
    readonly projectId: string;
  };
};

export type ChapterDetailPageClientProps = {
  readonly params: {
    readonly projectId: string;
    readonly chapterId: string;
  };
};

export type SectionDetailPageClientProps = {
  readonly params: {
    readonly projectId: string;
    readonly chapterId: string;
    readonly sectionId: string;
  };
};

const ProjectDetailPageClient: NextPage<AuthorizedPageProps<ProjectDetailPageClientProps>> = ({ user, params }) => {
  const searchParams = useSearchParams();

  useInitProject(user.sub, params.projectId);
  useInitChapterList(user.sub, params.projectId);

  const loadableProject = useLoadableProject();

  if (loadableProject.state === 'notfound') {
    return <NotFoundError />;
  }

  const chapterId = searchParams.get(CHAPTER_ID_PARAM_KEY);
  const sectionId = searchParams.get(SECTION_ID_PARAM_KEY);

  if (chapterId && sectionId) {
    return <SectionDetailPageClient params={{ ...params, chapterId, sectionId }} user={user} />;
  }

  if (chapterId) {
    return <ChapterDetailPageClient params={{ ...params, chapterId }} user={user} />;
  }

  return <ProjectView user={user} />;
};

const ChapterDetailPageClient = ({ user, params }: AuthorizedPageProps<ChapterDetailPageClientProps>) => {
  useInitPaper(user.sub, params.projectId, params.chapterId);

  const loadableChapter = useLoadableChapterInList(params.chapterId);

  if (loadableChapter.state === 'notfound') {
    return <NotFoundError />;
  }

  return <ChapterView chapterId={params.chapterId} key={params.chapterId} projectId={params.projectId} user={user} />;
};

const SectionDetailPageClient = ({ user, params }: AuthorizedPageProps<SectionDetailPageClientProps>) => {
  useInitGraph(user.sub, params.projectId, params.chapterId, params.sectionId);

  const loadableSection = useLoadableSectionInChapter(params.chapterId, params.sectionId);

  if (loadableSection.state === 'notfound') {
    return <NotFoundError />;
  }

  return (
    <SectionView
      chapterId={params.chapterId}
      key={params.sectionId}
      projectId={params.projectId}
      sectionId={params.sectionId}
      user={user}
    />
  );
};

export default ProjectDetailPageClient;
