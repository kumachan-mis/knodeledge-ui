'use client';
import { useLoadableChapterList, useUpdateChapterInList } from '@/contexts/chapters';
import { useLoadableProject } from '@/contexts/projects';

import ChapterListComponent from './ChapterList';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ChapterListProps = {
  readonly user: Claims;
};

const ChapterList: React.FC<ChapterListProps> = ({ user }) => {
  const loadableProject = useLoadableProject();
  const loadableChapterList = useLoadableChapterList();
  const updateChapter = useUpdateChapterInList({ id: user.sub }, { id: loadableProject.data?.id ?? '' });
  return <ChapterListComponent loadableChapterList={loadableChapterList} onUpdateChapter={updateChapter} />;
};

export default ChapterList;
