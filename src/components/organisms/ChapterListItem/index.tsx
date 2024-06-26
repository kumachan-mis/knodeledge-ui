import { ChapterActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { Chapter, ChapterWithoutAutofield } from '@/openapi';

import ChapterListItemComponent from './ChapterListItem';

import React from 'react';

export type ChapterListItemProps = {
  readonly projectId: string;
  readonly chapter: Chapter;
  readonly maxChapterNumber: number;
  readonly onUpdateChapter: (chapter: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
};

const ChapterListItem: React.FC<ChapterListItemProps> = (props) => <ChapterListItemComponent {...props} />;

export default ChapterListItem;
