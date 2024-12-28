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

export type ProjectDetailPageContentProps = {
  readonly params: {
    readonly projectId: string;
  };
};

type ChapterDetailPageContentProps = {
  readonly params: {
    readonly projectId: string;
    readonly chapterId: string;
  };
};

type SectionDetailPageContentProps = {
  readonly params: {
    readonly projectId: string;
    readonly chapterId: string;
    readonly sectionId: string;
  };
};

const ProjectDetailPageContent: React.FC<AuthorizedPageProps<ProjectDetailPageContentProps>> = ({ user, params }) => {
  const searchParams = useSearchParams();

  const chapterId = searchParams.get(CHAPTER_ID_PARAM_KEY);
  const sectionId = searchParams.get(SECTION_ID_PARAM_KEY);

  if (chapterId && sectionId) {
    return <SectionDetailPageContent params={{ ...params, chapterId, sectionId }} user={user} />;
  }

  if (chapterId) {
    return <ChapterDetailPageContent params={{ ...params, chapterId }} user={user} />;
  }

  return <ProjectView user={user} />;
};

const ChapterDetailPageContent: React.FC<AuthorizedPageProps<ChapterDetailPageContentProps>> = ({ user, params }) => {
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

const SectionDetailPageContent: React.FC<AuthorizedPageProps<SectionDetailPageContentProps>> = ({ user, params }) => {
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

export default ProjectDetailPageContent;
