import { SectionListProps } from '../SectionList';
import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { ChapterWithoutAutofield, ChapterWithSections } from '@/openapi';

import ChapterListItemComponent from './ChapterListItem';

export type ChapterListItemProps = {
  readonly projectId: string;
  readonly chapter: ChapterWithSections;
  readonly maxChapterNumber: number;
  readonly onUpdateChapter: (chapter: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
  readonly onDeleteChapter: () => Promise<LoadableAction<ChapterActionError>>;
  readonly SectionList: React.FC<Omit<SectionListProps, 'user'>>;
};

const ChapterListItem: React.FC<ChapterListItemProps> = (props) => <ChapterListItemComponent {...props} />;

export default ChapterListItem;
