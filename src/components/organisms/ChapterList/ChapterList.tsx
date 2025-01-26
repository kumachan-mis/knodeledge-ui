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
};

const ChapterListComponent: React.FC<ChapterListComponentProps> = ({ projectId, chapterList, onUpdateChapter }) => (
  <List>
    {chapterList.map((chapter) => (
      <ChapterListItem
        chapter={chapter}
        key={chapter.id}
        maxChapterNumber={chapterList.length}
        onUpdateChapter={(updatedChapter) => onUpdateChapter(chapter.id, updatedChapter)}
        projectId={projectId}
      />
    ))}
  </List>
);

export default ChapterListComponent;
