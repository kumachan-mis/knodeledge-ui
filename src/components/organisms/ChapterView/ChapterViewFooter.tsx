import NextStepDialog from '../NextStepDialog';
import { SectionsActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { useDialog } from '@/hooks/dialog';
import { SectionWithoutAutofield } from '@/openapi';

import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

export type ChapterViewFooterComponentProps = {
  readonly sectionalizePaper: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
};

const ChapterViewFooterComponent: React.FC<ChapterViewFooterComponentProps> = ({ sectionalizePaper }) => {
  const { open: openNextStepDialog, onOpen: onOpenNextStepDialog, onClose: onCloseNextStepDialog } = useDialog();

  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }} variant="dense">
      <Button color="primary" onClick={onOpenNextStepDialog} variant="contained">
        Go to Next Step
      </Button>
      <NextStepDialog onClose={onCloseNextStepDialog} onSubmit={sectionalizePaper} open={openNextStepDialog} />
    </Toolbar>
  );
};

export default ChapterViewFooterComponent;
