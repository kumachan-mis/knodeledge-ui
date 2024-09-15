'use client';
import ChapterDialog from '@/components/organisms/ChapterDialog';
import { ChapterActionError, LoadableChapterList } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { LoadableProject } from '@/contexts/projects';
import { useDialog } from '@/hooks/dialog';
import { ChapterWithoutAutofield } from '@/openapi';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export type ChapterListHeaderComponentProps = {
  readonly loadableProject: LoadableProject;
  readonly loadableChapterList: LoadableChapterList;
  readonly onCreateChapter: (chapter: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
};

const ChapterListHeaderComponent: React.FC<ChapterListHeaderComponentProps> = ({
  loadableProject,
  loadableChapterList,
  onCreateChapter,
}) => {
  const { open: openNewChapterDialog, onOpen: onOpenNewChapterDialog, onClose: onCloseNewChapterDialog } = useDialog();

  if (loadableProject.state !== 'success' || loadableChapterList.state !== 'success') {
    return <Box alignItems="center" display="flex" width="100%" />;
  }

  return (
    <Box display="flex" width="100%">
      <Button
        LinkComponent={Link}
        color="inherit"
        href={`/projects/${loadableProject.data.id}`}
        sx={{ flexGrow: 1, textTransform: 'none' }}
      >
        <Typography fontWeight="bold" noWrap variant="subtitle1">
          {loadableProject.data.name}
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
            const maxChapterNumber = loadableChapterList.data.length + 1;
            return parseInt(value, 10) <= maxChapterNumber || 'chapter number is too large';
          },
        }}
      />
    </Box>
  );
};

export default ChapterListHeaderComponent;
