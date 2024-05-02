import ChapterDialog from '@/components/organisms/dialog/ChapterDialog';
import { ChapterActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { LoadableProject } from '@/contexts/projects';
import { useDialog } from '@/hooks/dialog';
import { ChapterWithoutAutofield } from '@/openapi';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';

export type ProjectDrawerHeaderComponentProps = {
  readonly loadableProject: LoadableProject;
  readonly onCreateChapter: (chapter: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
};

const ProjectDrawerHeaderComponent: React.FC<ProjectDrawerHeaderComponentProps> = ({
  loadableProject,
  onCreateChapter,
}) => {
  const { open: openNewChapterDialog, onOpen: onOpenNewChapterDialog, onClose: onCloseNewChapterDialog } = useDialog();

  if (loadableProject.state !== 'success') {
    return <Box alignItems="center" display="flex" width="100%" />;
  }

  return (
    <Box alignItems="center" display="flex" width="100%">
      <Typography flexGrow={1} fontWeight="bold" noWrap variant="subtitle1">
        {loadableProject.data.name}
      </Typography>
      <IconButton onClick={onOpenNewChapterDialog} size="small">
        <NoteAddIcon />
      </IconButton>
      <ChapterDialog
        defaultValues={{ name: '', number: '' }}
        onClose={onCloseNewChapterDialog}
        onSubmit={onCreateChapter}
        open={openNewChapterDialog}
        submitText="Create Chapter"
        title="New Chapter"
      />
    </Box>
  );
};

export default ProjectDrawerHeaderComponent;
