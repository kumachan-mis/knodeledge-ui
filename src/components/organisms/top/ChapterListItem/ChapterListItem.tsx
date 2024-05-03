'use client';
import { ChapterActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { useMenu } from '@/hooks/menu';
import { Chapter, ChapterWithoutAutofield } from '@/openapi';

import ChapterListItemMenuComponent from './ChapterListItemMenu';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

export type ChapterListItemComponentProps = {
  readonly chapter: Chapter;
  readonly maxChapterNumber: number;
  readonly onUpdateChapter: (chapter: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
};

const ChapterListItemComponent: React.FC<ChapterListItemComponentProps> = ({
  chapter,
  maxChapterNumber,
  onUpdateChapter,
}) => {
  const {
    open: chapterMenuOpen,
    anchorEl: chapterMenuAnchorEl,
    onOpen: onOpenChapterMenu,
    onClose: onCloseChapterMenu,
  } = useMenu();

  return (
    <ListItem key={chapter.id}>
      <ListItemText primaryTypographyProps={{ variant: 'subtitle1' }}>
        {`#${chapter.number} ${chapter.name}`}
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          aria-controls={chapterMenuOpen ? `chapter-list-item-menu-${chapter.number}` : undefined}
          aria-expanded={chapterMenuOpen ? 'true' : undefined}
          aria-haspopup="true"
          aria-label="chapter menu"
          edge="end"
          id={`chapter-list-item-buttom-${chapter.number}`}
          onClick={onOpenChapterMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <ChapterListItemMenuComponent
          anchorEl={chapterMenuAnchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          aria-labelledby={`chapter-list-item-buttom-${chapter.number}`}
          chapter={chapter}
          id={`chapter-list-item-menu-${chapter.number}`}
          maxChapterNumber={maxChapterNumber}
          onClose={onCloseChapterMenu}
          onUpdateChapter={onUpdateChapter}
          open={chapterMenuOpen}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ChapterListItemComponent;
