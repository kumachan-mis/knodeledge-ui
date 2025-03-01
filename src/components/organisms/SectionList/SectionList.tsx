import SectionListItem from '../SectionListItem';
import { GraphActionError } from '@/contexts/openapi/graphs';
import { LoadableAction } from '@/contexts/openapi/types';
import { SectionOfChapter } from '@/openapi';

import List from '@mui/material/List';

export type SectionListComponentProps = {
  readonly projectId: string;
  readonly chapterId: string;
  readonly sections: SectionOfChapter[];
  readonly onDeleteSection: (id: string) => Promise<LoadableAction<GraphActionError>>;
};

const SectionListComponent: React.FC<SectionListComponentProps> = ({
  projectId,
  chapterId,
  sections,
  onDeleteSection,
}) => (
  <List dense disablePadding>
    {sections.map((section) => (
      <SectionListItem
        chapterId={chapterId}
        key={section.id}
        onDeleteSection={() => onDeleteSection(section.id)}
        projectId={projectId}
        section={section}
      />
    ))}
  </List>
);

export default SectionListComponent;
