'use client';
import ChapterDialog from '@/components/organisms/dialog/ChapterDialog';
import { ChapterActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { useDialog } from '@/hooks/dialog';
import { Chapter, ChapterWithoutAutofield } from '@/openapi';

import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';

export type ChapterListItemMenuComponentProps = {
  readonly chapter: Chapter;
  readonly maxChapterNumber: number;
  readonly onUpdateChapter: (chapter: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
} & MenuProps;

const ChapterListItemMenuComponent: React.FC<ChapterListItemMenuComponentProps> = ({
  chapter,
  maxChapterNumber,
  onUpdateChapter,
  ...rest
}) => {
  const {
    open: openUpdateChapterDialog,
    onOpen: onOpenUpdateChapterDialog,
    onClose: onCloseUpdateChapterDialog,
  } = useDialog();

  return (
    <Menu {...rest}>
      <MenuItem onClick={onOpenUpdateChapterDialog}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Update Chapter</ListItemText>
      </MenuItem>
      <ChapterDialog
        defaultValues={{ name: chapter.name, number: chapter.number.toString(10) }}
        onClose={onCloseUpdateChapterDialog}
        onSubmit={onUpdateChapter}
        open={openUpdateChapterDialog}
        submitText="Save Changes"
        title="Update Chapter"
        validates={{ number: (value) => parseInt(value, 10) <= maxChapterNumber || 'chapter number is too large' }}
      />
    </Menu>
  );
};

export default ChapterListItemMenuComponent;
