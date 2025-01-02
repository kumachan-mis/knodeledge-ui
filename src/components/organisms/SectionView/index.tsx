import { useLoadableActiveChapterInList, useLoadableActiveSectionInList } from '@/contexts/openapi/chapters';
import { useLoadableGraph, useUpdateGraph } from '@/contexts/openapi/graphs';
import { useLoadableProject } from '@/contexts/openapi/projects';

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
  const loadableChapter = useLoadableActiveChapterInList();
  const loadableSection = useLoadableActiveSectionInList();
  const loadableGraph = useLoadableGraph(sectionId);

  const updateGraph = useUpdateGraph({ id: user.sub }, projectId, chapterId, sectionId);

  return (
    <SectionViewComponent
      chapter={loadableChapter.data}
      loadableGraph={loadableGraph}
      project={loadableProject.data}
      section={loadableSection.data}
      updateGraph={updateGraph}
    />
  );
};

export default SectionView;
