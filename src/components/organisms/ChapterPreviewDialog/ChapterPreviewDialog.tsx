'use client';
import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { Chapter } from '@/openapi';

import ChapterPreviewDialogFormComponent from './ChapterPreviewDialogForm';

import { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export type ChapterPreviewDialogComponentProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly submitColor?: ButtonProps['color'];
  readonly chapter: Chapter;
  readonly onSubmit: () => Promise<LoadableAction<ChapterActionError>>;
  readonly onClose: () => void;
};

const ChapterPreviewDialogComponent: React.FC<ChapterPreviewDialogComponentProps> = ({ open, title, ...rest }) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>{title}</DialogTitle>
    <ChapterPreviewDialogFormComponent {...rest} />
  </Dialog>
);

export default ChapterPreviewDialogComponent;
