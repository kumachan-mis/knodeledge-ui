import { SectionWithoutAutofield } from '@/openapi';

import styled from '@emotion/styled';
import React from 'react';
import { ViewerTextFieldRoot, ViewerTextFieldBody, ViewerRoot, ViewerHeader } from 'react-clay-editor';

type NextStepDialogViewerComponentProps = {
  readonly section: SectionWithoutAutofield;
};

const NextStepDialogViewerComponent: React.FC<NextStepDialogViewerComponentProps> = ({ section }) => (
  <NextStepDialogViewerRoot text={section.content}>
    <ViewerTextFieldRoot>
      <ViewerHeader header={section.name} />
      <ViewerTextFieldBody />
    </ViewerTextFieldRoot>
  </NextStepDialogViewerRoot>
);

const NextStepDialogViewerRoot = styled(ViewerRoot)({
  '&&': {
    width: '100%',
    height: '320px',
  },
});

export default NextStepDialogViewerComponent;
