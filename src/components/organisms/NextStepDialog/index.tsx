import { SectionsActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { usePaperContent } from '@/contexts/views';
import { SectionWithoutAutofield } from '@/openapi';

import NextStepDialogComponent from './NextStepDialog';

export type NextStepDialogProps = {
  readonly open: boolean;
  readonly onSubmit: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
  readonly onClose: () => void;
};

const NextStepDialog: React.FC<NextStepDialogProps> = (props) => {
  const paper = usePaperContent();
  const sections: SectionWithoutAutofield[] = [
    {
      name: 'Dummy Section',
      content: `paper content has ${paper.content.length} characters`,
    },
  ];
  return <NextStepDialogComponent sections={sections} {...props} />;
};

export default NextStepDialog;
