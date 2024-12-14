import styled from '@emotion/styled';
import React from 'react';
import { ViewerTextFieldRoot, ViewerTextFieldBody, ViewerRoot, ViewerHeader } from 'react-clay-editor';

type NextStepDialogViewerComponentProps = {
  readonly headerSize?: 'normal' | 'larger' | 'largest';
  readonly header?: string;
  readonly content: string;
};

const NextStepDialogViewerComponent: React.FC<NextStepDialogViewerComponentProps> = ({
  headerSize,
  header,
  content,
}) => (
  <NextStepDialogViewerRoot text={content}>
    <ViewerTextFieldRoot>
      {header && <ViewerHeader header={header} size={headerSize} />}
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
