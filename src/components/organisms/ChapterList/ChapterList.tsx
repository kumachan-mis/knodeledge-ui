import { SectionListProps } from '../SectionList';
import ChapterListItem from '@/components/organisms/ChapterListItem';
import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { ChapterWithoutAutofield, ChapterWithSections } from '@/openapi';

import List from '@mui/material/List';

export type ChapterListComponentProps = {
  readonly projectId: string;
  readonly chapterList: ChapterWithSections[];
  readonly onUpdateChapter: (
    id: string,
    chapter: ChapterWithoutAutofield,
  ) => Promise<LoadableAction<ChapterActionError>>;
  readonly onDeleteChapter: (id: string) => Promise<LoadableAction<ChapterActionError>>;
  readonly SectionList: React.FC<Omit<SectionListProps, 'user'>>;
};

const ChapterListComponent: React.FC<ChapterListComponentProps> = ({
  projectId,
  chapterList,
  onUpdateChapter,
  onDeleteChapter,
  SectionList,
}) => (
  <List>
    {chapterList.map((chapter) => (
      <ChapterListItem
        SectionList={SectionList}
        chapter={chapter}
        key={chapter.id}
        maxChapterNumber={chapterList.length}
        onDeleteChapter={() => onDeleteChapter(chapter.id)}
        onUpdateChapter={(updatedChapter) => onUpdateChapter(chapter.id, updatedChapter)}
        projectId={projectId}
      />
    ))}
  </List>
);

export default ChapterListComponent;
