'use client';
import { SectionsActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { SectionWithoutAutofield } from '@/openapi';

import NextStepDialogFormComponent from './NextStepDialogForm';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export type NextStepDialogComponentProps = {
  readonly open: boolean;
  readonly sections: SectionWithoutAutofield[];
  readonly onSubmit: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
  readonly onClose: () => void;
};

const NextStepDialogComponent: React.FC<NextStepDialogComponentProps> = ({ open, ...rest }) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>Next Step</DialogTitle>
    <NextStepDialogFormComponent {...rest} />
  </Dialog>
);

export default NextStepDialogComponent;
