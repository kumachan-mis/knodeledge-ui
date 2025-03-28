import { CHAPTER_ID_PARAM_KEY, PROJECTS_ID_PATH_NAME } from '@/utils/page';

import { SaveResult, useAppBreadcrumbsSaving } from './AppBreadcrumbs.hooks';

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

export type AppBreadcrumbsProps = {
  readonly project: BreadcrumbItem;
  readonly chapter: BreadcrumbItem;
  readonly section?: BreadcrumbItem;
  readonly dirty: boolean;
  readonly children?: React.ReactNode;
  readonly onSave: () => Promise<SaveResult>;
};

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = ({ project, chapter, section, onSave, dirty, children }) => {
  const { savingError, onSaveClick, onClearSavingError } = useAppBreadcrumbsSaving({ dirty, onSave });

  return (
    <Box sx={{ width: '100%', display: 'flex' }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          '& a': {
            textDecoration: 'none',
            color: 'inherit',
            ':hover': {
              textDecoration: 'underline',
            },
          },
        }}
      >
        <Link href={`/${PROJECTS_ID_PATH_NAME}/${project.id}`}>
          <Typography color="inherit">{project.name}</Typography>
        </Link>
        {section ? (
          <Link href={`/${PROJECTS_ID_PATH_NAME}/${project.id}?${CHAPTER_ID_PARAM_KEY}=${chapter.id}`}>
            <Typography color="inherit">{chapter.name}</Typography>
          </Link>
        ) : (
          <Typography color="inherit" fontStyle={dirty ? 'italic' : undefined}>
            {`${chapter.name}${dirty ? ' *' : ''}`}
          </Typography>
        )}
        {section && (
          <Typography color="inherit" fontStyle={dirty ? 'italic' : undefined}>
            {`${section.name}${dirty ? ' *' : ''}`}
          </Typography>
        )}
      </Breadcrumbs>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <Button color="primary" disabled={!dirty} onClick={onSaveClick} size="small">
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
