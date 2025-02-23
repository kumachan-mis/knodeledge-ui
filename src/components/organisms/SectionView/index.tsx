import { useLoadableActiveChapterInList, useLoadableActiveSectionInList } from '@/contexts/openapi/chapters';
import { useLoadableGraph, useUpdateGraph } from '@/contexts/openapi/graphs';
import { useLoadableProject } from '@/contexts/openapi/projects';

import SectionViewComponent from './SectionView';

import { User } from '@auth0/nextjs-auth0/types';

export type SectionViewProps = {
  readonly user: User;
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
      onUpdateGraph={updateGraph}
      project={loadableProject.data}
      section={loadableSection.data}
    />
  );
};

export default SectionView;
