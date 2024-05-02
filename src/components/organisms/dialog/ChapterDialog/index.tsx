import { ChapterActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { ChapterWithoutAutofield } from '@/openapi';

import ChapterDialogComponent from './ChapterDialog';
import { ChapterFieldValidates, ChapterFieldValues } from './ChapterDialogForm';

import React from 'react';

export type ChapterDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly defaultValues: ChapterFieldValues;
  readonly validates?: ChapterFieldValidates;
  readonly onSubmit: (project: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
  readonly onClose: () => void;
};

const ChapterDialog: React.FC<ChapterDialogProps> = (props) => <ChapterDialogComponent {...props} />;

export default ChapterDialog;
