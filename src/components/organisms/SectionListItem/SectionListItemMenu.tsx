'use client';
import { GraphActionError } from '@/contexts/openapi/graphs';
import { LoadableAction } from '@/contexts/openapi/types';

import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

export type SectionListItemMenuComponentProps = {
  readonly onDeleteSection: () => Promise<LoadableAction<GraphActionError>>;
} & MenuProps;

const SectionListItemMenuComponent: React.FC<SectionListItemMenuComponentProps> = ({ onDeleteSection, ...rest }) => {
  const [sectionActionError, setSectionActionError] = React.useState<string>('');

  const onDeleteSectionClick = () => {
    void onDeleteSection().then((result) => {
      if (result.state === 'error') {
        setSectionActionError(result.error.message);
      }
    });
  };

  const onClearSectionActionError = () => {
    setSectionActionError('');
  };

  return (
    <Menu {...rest} sx={{ '& a': { textDecoration: 'none', color: 'inherit' } }}>
      <MenuItem onClick={onDeleteSectionClick}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Section</ListItemText>
      </MenuItem>
      <Snackbar onClose={onClearSectionActionError} open={!!sectionActionError}>
        <Alert onClose={onClearSectionActionError} severity="error" sx={{ width: '100%' }} variant="filled">
          {sectionActionError}
        </Alert>
      </Snackbar>
    </Menu>
  );
};

export default SectionListItemMenuComponent;
