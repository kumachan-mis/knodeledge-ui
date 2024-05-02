import ChapterDialog from '@/components/organisms/dialog/ChapterDialog';
import { ChapterActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { useDialog } from '@/hooks/dialog';
import { Chapter, ChapterWithoutAutofield } from '@/openapi';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
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
    open: openUpdateChapterDialog,
    onOpen: onOpenUpdateChapterDialog,
    onClose: onCloseUpdateChapterDialog,
  } = useDialog();

  return (
    <ListItem
      key={chapter.id}
      secondaryAction={
        <IconButton aria-label="chapter menu" edge="end" onClick={onOpenUpdateChapterDialog}>
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListItemText primary={`#${chapter.number} ${chapter.name}`} primaryTypographyProps={{ variant: 'subtitle1' }} />
      <ChapterDialog
        defaultValues={{ name: chapter.name, number: chapter.number.toString(10) }}
        onClose={onCloseUpdateChapterDialog}
        onSubmit={onUpdateChapter}
        open={openUpdateChapterDialog}
        submitText="Save Changes"
        title="Update Chapter"
        validates={{ number: (value) => parseInt(value, 10) <= maxChapterNumber || 'chapter number is too large' }}
      />
    </ListItem>
  );
};

export default ChapterListItemComponent;
