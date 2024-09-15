import { SectionOfChapter } from '@/openapi';

import SectionListItemComponent from './SectionListItem';

export type SectionListItemProps = {
  readonly projectId: string;
  readonly chapterId: string;
  readonly section: SectionOfChapter;
};

const SectionListItem: React.FC<SectionListItemProps> = (props) => <SectionListItemComponent {...props} />;

export default SectionListItem;
