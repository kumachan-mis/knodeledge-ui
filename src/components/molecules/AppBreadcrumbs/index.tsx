import { useAppBreadcrumbsSaving } from './AppBreadcrumbs.hooks';

import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
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
  readonly isDirty?: boolean;
  readonly onSave?: () => void;
};

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = ({ project, chapter, onSave, isDirty }) => {
  useAppBreadcrumbsSaving({ isDirty, onSave });

  return (
    <Box sx={{ width: '100%', display: 'flex', my: onSave ? 0 : 1 }}>
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
      {onSave && (
        <Button onClick={onSave} size="small" startIcon={<SaveIcon />} variant="text">
          Save
        </Button>
      )}
    </Box>
  );
};

export default AppBreadcrumbs;
