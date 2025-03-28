import { useLoadableActiveChapterInList, useSectionalizePaper } from '@/contexts/openapi/chapters';
import { useLoadablePaper, useUpdatePaper } from '@/contexts/openapi/papers';
import { useLoadableProject } from '@/contexts/openapi/projects';

import ChapterViewComponent from './ChapterView';

import { User } from '@auth0/nextjs-auth0/types';

export type ChapterViewProps = {
  readonly user: User;
  readonly projectId: string;
  readonly chapterId: string;
};

const ChapterView: React.FC<ChapterViewProps> = ({ user, projectId, chapterId }) => {
  const loadableProject = useLoadableProject();
  const loadableChapter = useLoadableActiveChapterInList();
  const loadablePaper = useLoadablePaper(chapterId);

  const updatePaper = useUpdatePaper({ id: user.sub }, projectId, chapterId);
  const sectionalizePaper = useSectionalizePaper({ id: user.sub }, projectId, chapterId);

  return (
    <ChapterViewComponent
      chapter={loadableChapter.data}
      loadablePaper={loadablePaper}
      onSectionalizePaper={sectionalizePaper}
      onUpdatePaper={updatePaper}
      project={loadableProject.data}
    />
  );
};

export default ChapterView;
