import { useLoadableChapterInList, useLoadableSectionInChapter } from '@/contexts/chapters';
import { useLoadableGraph, useUpdateGraph } from '@/contexts/graphs';
import { useLoadableProject } from '@/contexts/projects';

import SectionViewComponent from './SectionView';

import { Claims } from '@auth0/nextjs-auth0';

export type SectionViewProps = {
  readonly user: Claims;
  readonly projectId: string;
  readonly chapterId: string;
  readonly sectionId: string;
};

const SectionView: React.FC<SectionViewProps> = ({ user, projectId, chapterId, sectionId }) => {
  const loadableProject = useLoadableProject();
  const loadableChapter = useLoadableChapterInList(chapterId);
  const loadableSection = useLoadableSectionInChapter(chapterId, sectionId);
  const loadableGraph = useLoadableGraph(sectionId);
  const updateGraph = useUpdateGraph({ id: user.sub }, projectId, chapterId, sectionId);
  return (
    <SectionViewComponent
      loadableChapter={loadableChapter}
      loadableGraph={loadableGraph}
      loadableProject={loadableProject}
      loadableSection={loadableSection}
      updateGraph={updateGraph}
    />
  );
};

export default SectionView;