'use client';
import SectionList, { SectionListProps } from '@/components/organisms/SectionList';
import { useDeleteChapterInList, useLoadableChapterList, useUpdateChapterInList } from '@/contexts/openapi/chapters';

import ChapterListComponent from './ChapterList';

import { User } from '@auth0/nextjs-auth0/types';
import React from 'react';

export type ChapterListProps = {
  readonly user: User;
  readonly projectId: string;
};

const ChapterList: React.FC<ChapterListProps> = ({ user, projectId }) => {
  const loadableChapterList = useLoadableChapterList();
  const updateChapter = useUpdateChapterInList({ id: user.sub }, { id: projectId });
  const deleteChapter = useDeleteChapterInList({ id: user.sub }, { id: projectId });

  const SectionListComponent = React.useCallback(
    (props: Omit<SectionListProps, 'user'>) => <SectionList {...props} user={user} />,
    [user],
  );

  return (
    <ChapterListComponent
      SectionList={SectionListComponent}
      chapterList={loadableChapterList.data}
      onDeleteChapter={deleteChapter}
      onUpdateChapter={updateChapter}
      projectId={projectId}
    />
  );
};

export default ChapterList;
