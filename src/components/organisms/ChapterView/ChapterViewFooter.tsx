import { LoadableAction } from '@/contexts/openapi';

import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

export type ChapterViewFooterComponentProps = {
  readonly onNextStep: () => Promise<LoadableAction<unknown>>;
};

const ChapterViewFooterComponent: React.FC<ChapterViewFooterComponentProps> = () => {
  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }} variant="dense">
      <Button color="primary" variant="contained">
        Go to Next Step
      </Button>
    </Toolbar>
  );
};

export default ChapterViewFooterComponent;
