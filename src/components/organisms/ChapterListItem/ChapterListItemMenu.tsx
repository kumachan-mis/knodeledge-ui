'use client';
import ChapterPreviewDialog from '../ChapterPreviewDialog';
import ChapterFormDialog from '@/components/organisms/ChapterFormDialog';
import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { useDialog } from '@/hooks/dialog';
import { ChapterWithSections, ChapterWithoutAutofield } from '@/openapi';
import { CHAPTER_ID_PARAM_KEY, PROJECTS_ID_PATH_NAME } from '@/utils/page';

import DeleteIcon from '@mui/icons-material/Delete';
import OpenNoteIcon from '@mui/icons-material/Description';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';

export type ChapterListItemMenuComponentProps = {
  readonly projectId: string;
  readonly chapter: ChapterWithSections;
  readonly maxChapterNumber: number;
  readonly onUpdateChapter: (chapter: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
  readonly onDeleteChapter: () => Promise<LoadableAction<ChapterActionError>>;
} & MenuProps;

const ChapterListItemMenuComponent: React.FC<ChapterListItemMenuComponentProps> = ({
  projectId,
  chapter,
  maxChapterNumber,
  onUpdateChapter,
  onDeleteChapter,
  ...rest
}) => {
  const {
    open: openUpdateChapterDialog,
    onOpen: onOpenUpdateChapterDialog,
    onClose: onCloseUpdateChapterDialog,
  } = useDialog();

  const {
    open: openDeleteChapterDialog,
    onOpen: onOpenDeleteChapterDialog,
    onClose: onCloseDeleteChapterDialog,
  } = useDialog();

  return (
    <Menu {...rest} sx={{ '& a': { textDecoration: 'none', color: 'inherit' } }}>
      <Link href={`/${PROJECTS_ID_PATH_NAME}/${projectId}?${CHAPTER_ID_PARAM_KEY}=${chapter.id}`}>
        <MenuItem>
          <ListItemIcon>
            <OpenNoteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open Chapter</ListItemText>
        </MenuItem>
      </Link>
      <MenuItem onClick={onOpenUpdateChapterDialog}>
        <ListItemIcon>
          <EditNoteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Update Chapter</ListItemText>
      </MenuItem>
      <MenuItem onClick={onOpenDeleteChapterDialog}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Chapter</ListItemText>
      </MenuItem>
      <ChapterFormDialog
        defaultValues={{ name: chapter.name, number: chapter.number.toString(10) }}
        onClose={onCloseUpdateChapterDialog}
        onSubmit={onUpdateChapter}
        open={openUpdateChapterDialog}
        submitText="Save Changes"
        title="Update Chapter"
        validates={{ number: (value) => parseInt(value, 10) <= maxChapterNumber || 'chapter number is too large' }}
      />
      <ChapterPreviewDialog
        chapter={chapter}
        onClose={onCloseDeleteChapterDialog}
        onSubmit={onDeleteChapter}
        open={openDeleteChapterDialog}
        submitColor="error"
        submitText="Delete Chapter"
        title="Delete Chapter"
      />
    </Menu>
  );
};

export default ChapterListItemMenuComponent;
