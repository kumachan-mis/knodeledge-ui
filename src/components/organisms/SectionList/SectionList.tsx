import SectionListItem from '../SectionListItem';
import { SectionOfChapter } from '@/openapi';

import List from '@mui/material/List';

export type SectionListComponentProps = {
  readonly projectId: string;
  readonly chapterId: string;
  readonly sections: SectionOfChapter[];
};

const SectionListComponent: React.FC<SectionListComponentProps> = ({ projectId, chapterId, sections }) => (
  <List dense disablePadding>
    {sections.map((section) => (
      <SectionListItem chapterId={chapterId} key={section.id} projectId={projectId} section={section} />
    ))}
  </List>
);

export default SectionListComponent;
