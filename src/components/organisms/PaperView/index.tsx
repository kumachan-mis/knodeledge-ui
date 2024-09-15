import { useLoadableChapterInList } from '@/contexts/chapters';
import { useLoadablePaper, useUpdatePaper } from '@/contexts/papers';
import { useLoadableProject } from '@/contexts/projects';

import PaperViewComponent from './PaperView';

import { Claims } from '@auth0/nextjs-auth0';

export type PaperViewProps = {
  readonly user: Claims;
  readonly projectId: string;
  readonly chapterId: string;
};

const PaperView: React.FC<PaperViewProps> = ({ user, projectId, chapterId }) => {
  const loadableProject = useLoadableProject();
  const loadableChapter = useLoadableChapterInList(chapterId);
  const loadablePaper = useLoadablePaper(chapterId);
  const updatePaper = useUpdatePaper({ id: user.sub }, projectId, chapterId);
  return (
    <PaperViewComponent
      loadableChapter={loadableChapter}
      loadablePaper={loadablePaper}
      loadableProject={loadableProject}
      updatePaper={updatePaper}
    />
  );
};

export default PaperView;
