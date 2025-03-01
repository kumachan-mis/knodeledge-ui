import { GraphActionError } from '@/contexts/openapi/graphs';
import { LoadableAction } from '@/contexts/openapi/types';
import { SectionOfChapter } from '@/openapi';

import SectionListItemComponent from './SectionListItem';

export type SectionListItemProps = {
  readonly projectId: string;
  readonly chapterId: string;
  readonly section: SectionOfChapter;
  readonly onDeleteSection: () => Promise<LoadableAction<GraphActionError>>;
};

const SectionListItem: React.FC<SectionListItemProps> = (props) => <SectionListItemComponent {...props} />;

export default SectionListItem;
