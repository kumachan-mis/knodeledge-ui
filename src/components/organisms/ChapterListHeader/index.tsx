'use client';
import { useCreateChapterInList, useLoadableChapterList } from '@/contexts/openapi/chapters';
import { useLoadableProject } from '@/contexts/openapi/projects';

import ChapterListHeaderComponent from './ChapterListHeader';

import { User } from '@auth0/nextjs-auth0/types';

export type ChapterListHeaderProps = {
  readonly user: User;
  readonly projectId: string;
};

const ChapterListHeader: React.FC<ChapterListHeaderProps> = ({ user, projectId }) => {
  const loadableProject = useLoadableProject();
  const loadableChapterList = useLoadableChapterList();
  const createChapter = useCreateChapterInList({ id: user.sub }, { id: projectId });
  return (
    <ChapterListHeaderComponent
      chapterList={loadableChapterList.data}
      onCreateChapter={createChapter}
      project={loadableProject.data}
    />
  );
};

export default ChapterListHeader;
