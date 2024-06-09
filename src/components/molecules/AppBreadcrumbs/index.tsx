import { SaveResult, useAppBreadcrumbsSaving } from './AppBreadcrumbs.hooks';

import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';

type BreadcrumbItem = {
  readonly id: string;
  readonly name: string;
};

type AppBreadcrumbsProps = {
  readonly project: BreadcrumbItem;
  readonly chapter: BreadcrumbItem;
  readonly isDirty: boolean;
  readonly onSave: () => Promise<SaveResult>;
};

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = ({ project, chapter, onSave, isDirty }) => {
  const { savingError, onSaveClick, onClearSavingError } = useAppBreadcrumbsSaving({ isDirty, onSave });

  return (
    <Box sx={{ width: '100%', display: 'flex' }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          '& a': {
            textDecoration: 'none',
            color: 'inherit',
            ':hover': {
              textDecoration: 'underline',
            },
          },
          flexGrow: 1,
        }}
      >
        <Link href={`/projects/${project.id}`}>
          <Typography color="inherit">{project.name}</Typography>
        </Link>
        <Typography color="inherit" fontStyle={isDirty ? 'italic' : undefined}>
          {`${chapter.name}${isDirty ? ' *' : ''}`}
        </Typography>
      </Breadcrumbs>
      <Button onClick={onSaveClick} size="small" startIcon={<SaveIcon />} variant="text">
        Save
      </Button>
      <Snackbar onClose={onClearSavingError} open={!!savingError}>
        <Alert onClose={onClearSavingError} severity="error" sx={{ width: '100%' }} variant="filled">
          {savingError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppBreadcrumbs;
