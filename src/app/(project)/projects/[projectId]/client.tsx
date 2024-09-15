'use client';
import NotFoundError from '@/components/organisms/NotFoundError';
import PaperView from '@/components/organisms/PaperView';
import ProjectTopView from '@/components/organisms/ProjectTopView';
import { useInitChapterList, useLoadableChapterInList } from '@/contexts/chapters';
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

  useInitProject({ id: user.sub }, params.projectId);
  useInitChapterList({ id: user.sub }, params.projectId);

  const loadableProject = useLoadableProject();

  if (loadableProject.state === 'notfound') {
    return <NotFoundError />;
  }

  const chapterId = searchParams.get(CHAPTER_ID_PARAM_KEY);
  if (chapterId) {
    return <ChapterDetailPageClient params={{ ...params, chapterId }} user={user} />;
  }

  return <ProjectTopView user={user} />;
};

const ChapterDetailPageClient = ({ user, params }: AuthorizedPageProps<ChapterDetailPageClientProps>) => {
  const searchParams = useSearchParams();

  useInitPaper({ id: user.sub }, params.projectId, params.chapterId);

  const loadableChapter = useLoadableChapterInList(params.chapterId);

  if (loadableChapter.state === 'notfound') {
    return <NotFoundError />;
  }

  const sectionId = searchParams.get(SECTION_ID_PARAM_KEY);
  if (sectionId) {
    return <SectionDetailPageClient params={{ ...params, chapterId: params.chapterId, sectionId }} user={user} />;
  }

  return <PaperView chapterId={params.chapterId} key={params.chapterId} projectId={params.projectId} user={user} />;
};

const SectionDetailPageClient = ({ params }: AuthorizedPageProps<SectionDetailPageClientProps>) => {
  return <div>{`SectionDetailPageClient: ${params.sectionId}`}</div>;
};

export default ProjectDetailPageClient;
