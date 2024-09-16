import { useLoadableChapterInList, useLoadableSectionInChapter } from '@/contexts/chapters';
import { useLoadableGraph } from '@/contexts/graphs';
import { useLoadableProject } from '@/contexts/projects';

import SectionViewComponent from './SectionView';

import { Claims } from '@auth0/nextjs-auth0';

export type SectionViewProps = {
  readonly user: Claims;
  readonly projectId: string;
  readonly chapterId: string;
  readonly sectionId: string;
};

const SectionView: React.FC<SectionViewProps> = ({ chapterId, sectionId }) => {
  const loadableProject = useLoadableProject();
  const loadableChapter = useLoadableChapterInList(chapterId);
  const loadableSection = useLoadableSectionInChapter(chapterId, sectionId);
  const loadableGraph = useLoadableGraph(sectionId);
  return (
    <SectionViewComponent
      loadableChapter={loadableChapter}
      loadableGraph={loadableGraph}
      loadableProject={loadableProject}
      loadableSection={loadableSection}
    />
  );
};

export default SectionView;
