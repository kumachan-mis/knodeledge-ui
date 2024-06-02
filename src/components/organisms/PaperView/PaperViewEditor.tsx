'use client';
import { usePaperContent, useSetPaperContent } from '@/contexts/views';

import { styled } from '@mui/material/styles';
import React from 'react';
import { EditorRoot, EditorSyntaxMenu, Divider, EditorTextFieldRoot, EditorTextFieldBody } from 'react-clay-editor';
import 'katex/dist/katex.min.css';

const PaperViewEditorComponent: React.FC = () => {
  const content = usePaperContent();
  const setContent = useSetPaperContent();

  return (
    <PaperViewEditorRoot setText={setContent} text={content}>
      <EditorSyntaxMenu />
      <Divider />
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </PaperViewEditorRoot>
  );
};

const PaperViewEditorRoot = styled(EditorRoot)(({ theme }) => ({
  '&&': {
    width: '100%',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(5)})`,
  },
}));

export default PaperViewEditorComponent;
