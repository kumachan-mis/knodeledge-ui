import { LoadableAction } from '@/contexts/openapi';
import { PaperActionError } from '@/contexts/papers';
import { Paper, PaperWithoutAutofield } from '@/openapi';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import React from 'react';
import { EditorRoot, EditorSyntaxMenu, Divider, EditorTextFieldRoot, EditorTextFieldBody } from 'react-clay-editor';

export type PaperEditorComponentProps = {
  readonly paper: Paper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const PaperEditorComponent: React.FC<PaperEditorComponentProps> = ({ paper, updatePaper }) => {
  const [content, setContent] = React.useState(paper.content);

  return (
    <PaperEditorRoot setText={setContent} text={content}>
      <EditorSyntaxMenu />
      <Divider />
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
      <Divider />
      <PaperEditorFooter onSave={() => void updatePaper(paper.id, { content })} />
    </PaperEditorRoot>
  );
};

const PaperEditorRoot = styled(EditorRoot)(({ theme }) => ({
  '&&': {
    width: '100%',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(2)})`,
  },
}));

const PaperEditorFooter: React.FC<{ readonly onSave: () => void }> = ({ onSave }) => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
    <Button color="primary" onClick={onSave} size="small" sx={{ m: 1 }} variant="contained">
      Save
    </Button>
  </Box>
);

export default PaperEditorComponent;
