'use client';
import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { ChapterWithoutAutofield } from '@/openapi';

import ChapterFormDialogFormComponent, { ChapterFieldValidates, ChapterFieldValues } from './ChapterFormDialogForm';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export type ChapterFormDialogComponentProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ChapterFieldValues;
  readonly validates?: ChapterFieldValidates;
  readonly onSubmit: (project: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
  readonly onClose: () => void;
};

const ChapterFormDialogComponent: React.FC<ChapterFormDialogComponentProps> = ({ open, title, ...rest }) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>{title}</DialogTitle>
    <ChapterFormDialogFormComponent {...rest} />
  </Dialog>
);

export default ChapterFormDialogComponent;
