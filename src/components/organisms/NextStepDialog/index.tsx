import { SectionsActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { SectionWithoutAutofield } from '@/openapi';

import NextStepDialogComponent from './NextStepDialog';

export type NextStepDialogProps = {
  readonly open: boolean;
  readonly onSubmit: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
  readonly onClose: () => void;
};

const NextStepDialog: React.FC<NextStepDialogProps> = (props) => <NextStepDialogComponent {...props} />;

export default NextStepDialog;
