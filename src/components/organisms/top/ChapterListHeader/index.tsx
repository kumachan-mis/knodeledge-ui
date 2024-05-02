'use client';
import { useCreateChapterInList, useLoadableChapterList } from '@/contexts/chapters';
import { useLoadableProject } from '@/contexts/projects';

import ChapterListHeaderComponent from './ChapterListHeader';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ChapterListHeaderProps = {
  readonly user: Claims;
};

const ChapterListHeader: React.FC<ChapterListHeaderProps> = ({ user }) => {
  const loadableProject = useLoadableProject();
  const loadableChapterList = useLoadableChapterList();
  const createChapter = useCreateChapterInList({ id: user.sub }, { id: loadableProject.data?.id ?? '' });
  return (
    <ChapterListHeaderComponent
      loadableChapterList={loadableChapterList}
      loadableProject={loadableProject}
      onCreateChapter={createChapter}
    />
  );
};

export default ChapterListHeader;
