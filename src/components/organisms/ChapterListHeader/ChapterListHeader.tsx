'use client';
import ChapterDialog from '@/components/organisms/ChapterDialog';
import { ChapterActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { useDialog } from '@/hooks/dialog';
import { ChapterWithoutAutofield, ChapterWithSections, Project } from '@/openapi';
import { PROJECTS_ID_PATH_NAME } from '@/utils/page';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export type ChapterListHeaderComponentProps = {
  readonly project: Project;
  readonly chapterList: ChapterWithSections[];
  readonly onCreateChapter: (chapter: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
};

const ChapterListHeaderComponent: React.FC<ChapterListHeaderComponentProps> = ({
  project,
  chapterList,
  onCreateChapter,
}) => {
  const { open: openNewChapterDialog, onOpen: onOpenNewChapterDialog, onClose: onCloseNewChapterDialog } = useDialog();

  return (
    <Box display="flex" width="100%">
      <Button
        LinkComponent={Link}
        color="inherit"
        href={`/${PROJECTS_ID_PATH_NAME}/${project.id}`}
        sx={{ flexGrow: 1, textTransform: 'none' }}
      >
        <Typography fontWeight="bold" noWrap variant="subtitle1">
          {project.name}
        </Typography>
      </Button>
      <IconButton aria-label="new chapter" onClick={onOpenNewChapterDialog} size="small">
        <NoteAddIcon />
      </IconButton>
      <ChapterDialog
        defaultValues={{ name: '', number: '' }}
        onClose={onCloseNewChapterDialog}
        onSubmit={onCreateChapter}
        open={openNewChapterDialog}
        submitText="Create Chapter"
        title="New Chapter"
        validates={{
          number: (value) => {
            const maxChapterNumber = chapterList.length + 1;
            return parseInt(value, 10) <= maxChapterNumber || 'chapter number is too large';
          },
        }}
      />
    </Box>
  );
};

export default ChapterListHeaderComponent;
