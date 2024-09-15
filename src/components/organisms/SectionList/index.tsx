import { SectionOfChapter } from '@/openapi';

import SectionListComponent from './SectionList';

export type SectionListProps = {
  readonly projectId: string;
  readonly chapterId: string;
  readonly sections: SectionOfChapter[];
};

const SectionList: React.FC<SectionListProps> = (props) => <SectionListComponent {...props} />;

export default SectionList;
