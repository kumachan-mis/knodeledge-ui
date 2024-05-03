import ChapterListItem from '@/components/organisms/top/ChapterListItem';
import { ChapterActionError, LoadableChapterList } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { ChapterWithoutAutofield } from '@/openapi';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import React from 'react';

export type ChapterListComponentProps = {
  readonly loadableChapterList: LoadableChapterList;
  readonly onUpdateChapter: (
    id: string,
    chapter: ChapterWithoutAutofield,
  ) => Promise<LoadableAction<ChapterActionError>>;
};

const ChapterListComponent: React.FC<ChapterListComponentProps> = ({ loadableChapterList, onUpdateChapter }) =>
  loadableChapterList.state === 'loading' ? (
    <Box display="flex" justifyContent="center" p={12}>
      <CircularProgress />
    </Box>
  ) : (
    loadableChapterList.state === 'success' && (
      <List>
        {loadableChapterList.data.map((chapter) => (
          <ChapterListItem
            chapter={chapter}
            key={chapter.id}
            maxChapterNumber={loadableChapterList.data.length}
            onUpdateChapter={(updatedChapter) => onUpdateChapter(chapter.id, updatedChapter)}
          />
        ))}
      </List>
    )
  );

export default ChapterListComponent;
