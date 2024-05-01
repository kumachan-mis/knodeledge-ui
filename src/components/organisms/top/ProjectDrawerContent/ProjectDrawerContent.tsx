import { LoadableChapterList } from '@/contexts/chapters';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

export type ProjectDrawerContentComponentProps = {
  readonly loadableChapterList: LoadableChapterList;
};

const ProjectDrawerContentComponent: React.FC<ProjectDrawerContentComponentProps> = ({ loadableChapterList }) => {
  return loadableChapterList.state === 'loading' ? (
    <Box display="flex" justifyContent="center" p={12}>
      <CircularProgress />
    </Box>
  ) : (
    loadableChapterList.state === 'success' && (
      <List>
        {loadableChapterList.data.map((chapter) => (
          <ListItem key={chapter.id}>
            <ListItemText
              primary={`#${chapter.number} ${chapter.name}`}
              primaryTypographyProps={{ variant: 'subtitle1' }}
            />
          </ListItem>
        ))}
      </List>
    )
  );
};

export default ProjectDrawerContentComponent;
