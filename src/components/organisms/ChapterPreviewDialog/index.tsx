import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { Chapter } from '@/openapi';

import ChapterPreviewDialogComponent from './ChapterPreviewDialog';

import { ButtonProps } from '@mui/material/Button';

export type ChapterPreviewDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly submitColor?: ButtonProps['color'];
  readonly chapter: Chapter;
  readonly onSubmit: () => Promise<LoadableAction<ChapterActionError>>;
  readonly onClose: () => void;
};

const ChapterPreviewDialog: React.FC<ChapterPreviewDialogProps> = (props) => (
  <ChapterPreviewDialogComponent {...props} />
);

export default ChapterPreviewDialog;
