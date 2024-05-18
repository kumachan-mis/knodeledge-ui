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

const PaperEditorRoot = styled(EditorRoot)(({ theme }) => ({
  '&&': {
    width: '100%',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(2)})`,
  },
}));

export default PaperEditorComponent;
