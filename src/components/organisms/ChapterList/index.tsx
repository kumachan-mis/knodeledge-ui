'use client';
import { useLoadableChapterList, useUpdateChapterInList } from '@/contexts/openapi/chapters';

import ChapterListComponent from './ChapterList';

import { User } from '@auth0/nextjs-auth0/types';

export type ChapterListProps = {
  readonly user: User;
  readonly projectId: string;
};

const ChapterList: React.FC<ChapterListProps> = ({ user, projectId }) => {
  const loadableChapterList = useLoadableChapterList();
  const updateChapter = useUpdateChapterInList({ id: user.sub }, { id: projectId });
  return (
    <ChapterListComponent
      chapterList={loadableChapterList.data}
      onUpdateChapter={updateChapter}
      projectId={projectId}
    />
  );
};

export default ChapterList;
