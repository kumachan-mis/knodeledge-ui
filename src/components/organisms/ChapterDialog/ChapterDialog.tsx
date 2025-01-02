'use client';
import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { ChapterWithoutAutofield } from '@/openapi';

import ChapterDialogFormComponent, { ChapterFieldValidates, ChapterFieldValues } from './ChapterDialogForm';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export type ChapterDialogComponentProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ChapterFieldValues;
  readonly validates?: ChapterFieldValidates;
  readonly onSubmit: (project: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
  readonly onClose: () => void;
};

const ChapterDialogComponent: React.FC<ChapterDialogComponentProps> = ({ open, title, ...rest }) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>{title}</DialogTitle>
    <ChapterDialogFormComponent {...rest} />
  </Dialog>
);

export default ChapterDialogComponent;
