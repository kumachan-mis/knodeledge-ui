'use client';
import ChapterView from '@/components/organisms/ChapterView';
import NotFoundError from '@/components/organisms/NotFoundError';
import ProjectView from '@/components/organisms/ProjectView';
import SectionView from '@/components/organisms/SectionView';
import {
  ActiveChapterContextProvider,
  ActiveSectionContextProvider,
  useLoadableChapterList,
} from '@/contexts/chapters';
import { useInitGraph } from '@/contexts/graphs';
import { useInitPaper } from '@/contexts/papers';
import { AuthorizedPageProps } from '@/utils/page';
import { CHAPTER_ID_PARAM_KEY, SECTION_ID_PARAM_KEY } from '@/utils/params';

import { useSearchParams } from 'next/navigation';
import React from 'react';

export type ProjectDetailPageClientProps = {
  readonly params: {
    readonly projectId: string;
  };
};

type ChapterDetailPageClientProps = {
  readonly params: {
    readonly projectId: string;
    readonly chapterId: string;
  };
};

type SectionDetailPageClientProps = {
  readonly params: {
    readonly projectId: string;
    readonly chapterId: string;
    readonly sectionId: string;
  };
};

const ProjectDetailPageClient: React.FC<AuthorizedPageProps<ProjectDetailPageClientProps>> = ({ user, params }) => {
  const searchParams = useSearchParams();

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

const ChapterDetailPageClient: React.FC<AuthorizedPageProps<ChapterDetailPageClientProps>> = ({ user, params }) => {
  useInitPaper(user.sub, params.projectId, params.chapterId);

  const loadableChapterList = useLoadableChapterList();

  const activeChapter = loadableChapterList.data.find((chapter) => chapter.id === params.chapterId);
  if (!activeChapter) {
    return <NotFoundError />;
  }

  return (
    <ActiveChapterContextProvider activeChapter={activeChapter}>
      <ChapterView chapterId={params.chapterId} key={params.chapterId} projectId={params.projectId} user={user} />;
    </ActiveChapterContextProvider>
  );
};

const SectionDetailPageClient: React.FC<AuthorizedPageProps<SectionDetailPageClientProps>> = ({ user, params }) => {
  useInitGraph(user.sub, params.projectId, params.chapterId, params.sectionId);

  const loadableChapterList = useLoadableChapterList();

  const activeChapter = loadableChapterList.data.find((chapter) => chapter.id === params.chapterId);
  if (!activeChapter) {
    return <NotFoundError />;
  }

  const activeSection = activeChapter.sections.find((section) => section.id === params.sectionId);
  if (!activeSection) {
    return <NotFoundError />;
  }

  return (
    <ActiveChapterContextProvider activeChapter={activeChapter}>
      <ActiveSectionContextProvider activeSection={activeSection}>
        <SectionView
          chapterId={params.chapterId}
          key={params.sectionId}
          projectId={params.projectId}
          sectionId={params.sectionId}
          user={user}
        />
      </ActiveSectionContextProvider>
    </ActiveChapterContextProvider>
  );
};

export default ProjectDetailPageClient;
