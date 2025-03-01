import { useDeleteGraph } from '@/contexts/openapi/graphs';
import { SectionOfChapter } from '@/openapi';

import SectionListComponent from './SectionList';

import { User } from '@auth0/nextjs-auth0/types';

export type SectionListProps = {
  readonly user: User;
  readonly projectId: string;
  readonly chapterId: string;
  readonly sections: SectionOfChapter[];
};

const SectionList: React.FC<SectionListProps> = ({ user, projectId, chapterId, sections }) => {
  const deleteSection = useDeleteGraph({ id: user.sub }, projectId, chapterId);

  return (
    <SectionListComponent
      chapterId={chapterId}
      onDeleteSection={deleteSection}
      projectId={projectId}
      sections={sections}
    />
  );
};

export default SectionList;
