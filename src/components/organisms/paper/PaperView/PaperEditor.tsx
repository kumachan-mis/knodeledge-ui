import { LoadableAction } from '@/contexts/openapi';
import { PaperActionError } from '@/contexts/papers';
import { Paper, PaperWithoutAutofield } from '@/openapi';

import { styled } from '@mui/material/styles';
import React from 'react';
import { EditorRoot, EditorSyntaxMenu, Divider, EditorTextFieldRoot, EditorTextFieldBody } from 'react-clay-editor';

export type PaperEditorComponentProps = {
  readonly paper: Paper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const PaperEditorComponent: React.FC<PaperEditorComponentProps> = ({ paper }) => {
  const [text, setText] = React.useState(paper.content);

  return (
    <PaperEditorRoot setText={setText} text={text}>
      <EditorSyntaxMenu />
      <Divider />
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </PaperEditorRoot>
  );
};

const PaperEditorRoot = styled(EditorRoot)({
  '&&': {
    width: '100%',
  },
});

export default PaperEditorComponent;
