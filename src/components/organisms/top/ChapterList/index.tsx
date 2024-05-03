'use client';
import { useLoadableChapterList, useUpdateChapterInList } from '@/contexts/chapters';

import ChapterListComponent from './ChapterList';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ChapterListProps = {
  readonly user: Claims;
  readonly projectId: string;
};

const ChapterList: React.FC<ChapterListProps> = ({ user, projectId }) => {
  const loadableChapterList = useLoadableChapterList();
  const updateChapter = useUpdateChapterInList({ id: user.sub }, { id: projectId });
  return <ChapterListComponent loadableChapterList={loadableChapterList} onUpdateChapter={updateChapter} />;
};

export default ChapterList;
