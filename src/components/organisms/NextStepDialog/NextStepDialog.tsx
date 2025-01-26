'use client';
import { SectionsActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { SectionWithoutAutofield } from '@/openapi';

import NextStepDialogFormComponent from './NextStepDialogForm';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export type NextStepDialogComponentProps = {
  readonly open: boolean;
  readonly onSubmit: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
  readonly onClose: () => void;
};

const NextStepDialogComponent: React.FC<NextStepDialogComponentProps> = ({ open, ...rest }) => (
  <Dialog fullWidth maxWidth="lg" open={open}>
    <DialogTitle>Next Step</DialogTitle>
    <NextStepDialogFormComponent {...rest} />
  </Dialog>
);

export default NextStepDialogComponent;
