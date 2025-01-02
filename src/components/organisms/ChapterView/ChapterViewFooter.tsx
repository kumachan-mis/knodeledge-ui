import NextStepDialog from '../NextStepDialog';
import { SectionsActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { LoadablePaper } from '@/contexts/openapi/papers';
import { useDialog } from '@/hooks/dialog';
import { SectionWithoutAutofield } from '@/openapi';

import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

export type ChapterViewFooterComponentProps = {
  readonly loadablePaper: LoadablePaper;
  readonly sectionalizePaper: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
};

const ChapterViewFooterComponent: React.FC<ChapterViewFooterComponentProps> = ({
  loadablePaper,
  sectionalizePaper,
}) => {
  const { open: openNextStepDialog, onOpen: onOpenNextStepDialog, onClose: onCloseNextStepDialog } = useDialog();
  const disabled = loadablePaper.state !== 'success';

  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }} variant="dense">
      <Button color="primary" disabled={disabled} onClick={onOpenNextStepDialog} variant="contained">
        Go to Next Step
      </Button>
      <NextStepDialog onClose={onCloseNextStepDialog} onSubmit={sectionalizePaper} open={openNextStepDialog} />
    </Toolbar>
  );
};

export default ChapterViewFooterComponent;
