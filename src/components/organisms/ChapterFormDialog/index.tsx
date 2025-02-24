import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { ChapterWithoutAutofield } from '@/openapi';

import ChapterFormDialogComponent from './ChapterFormDialog';
import { ChapterFieldValidates, ChapterFieldValues } from './ChapterFormDialogForm';

export type ChapterFormDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ChapterFieldValues;
  readonly validates?: ChapterFieldValidates;
  readonly onSubmit: (project: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
  readonly onClose: () => void;
};

const ChapterFormDialog: React.FC<ChapterFormDialogProps> = (props) => <ChapterFormDialogComponent {...props} />;

export default ChapterFormDialog;
