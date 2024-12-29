import { useLoadableActiveChapterInList, useSectionalizePaper } from '@/contexts/chapters';
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
  const loadableChapter = useLoadableActiveChapterInList();
  const loadablePaper = useLoadablePaper(chapterId);

  const updatePaper = useUpdatePaper({ id: user.sub }, { id: projectId }, { id: chapterId });
  const sectionalizePaper = useSectionalizePaper({ id: user.sub }, { id: projectId }, { id: chapterId });

  return (
    <ChapterViewComponent
      chapter={loadableChapter.data}
      loadablePaper={loadablePaper}
      project={loadableProject.data}
      sectionalizePaper={sectionalizePaper}
      updatePaper={updatePaper}
    />
  );
};

export default ChapterView;
