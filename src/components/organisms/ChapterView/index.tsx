import { useLoadableChapterInList } from '@/contexts/chapters';
import { useLoadablePaper, useUpdatePaper } from '@/contexts/papers';
import { useLoadableProject } from '@/contexts/projects';

import ChapterViewComponent from './ChapterView';

import { Claims } from '@auth0/nextjs-auth0';

export type ChapterViewProps = {
  readonly user: Claims;
  readonly projectId: string;
  readonly chapterId: string;
};

const ChapterView: React.FC<ChapterViewProps> = ({ user, projectId, chapterId }) => {
  const loadableProject = useLoadableProject();
  const loadableChapter = useLoadableChapterInList(chapterId);
  const loadablePaper = useLoadablePaper(chapterId);
  const updatePaper = useUpdatePaper({ id: user.sub }, projectId, chapterId);
  return (
    <ChapterViewComponent
      loadableChapter={loadableChapter}
      loadablePaper={loadablePaper}
      loadableProject={loadableProject}
      updatePaper={updatePaper}
    />
  );
};

export default ChapterView;
