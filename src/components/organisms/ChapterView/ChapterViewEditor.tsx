'use client';
import { usePaperContent, useSetPaperContent } from '@/contexts/views';

import { styled } from '@mui/material/styles';
import React from 'react';
import { EditorRoot, EditorSyntaxMenu, Divider, EditorTextFieldRoot, EditorTextFieldBody } from 'react-clay-editor';
import 'katex/dist/katex.min.css';

const ChapterViewEditorComponent: React.FC = () => {
  const paper = usePaperContent();
  const setPaper = useSetPaperContent();

  const setText = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (typeof value === 'function') {
        setPaper((prev) => ({ ...prev, content: value(prev.content) }));
        return;
      }
      setPaper({ content: value });
    },
    [setPaper],
  );

  return (
    <ChapterViewEditorRoot setText={setText} text={paper.content}>
      <EditorSyntaxMenu />
      <Divider />
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </ChapterViewEditorRoot>
  );
};

const ChapterViewEditorRoot = styled(EditorRoot)(({ theme }) => ({
  '&&': {
    width: '100%',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(5)})`,
  },
}));

export default ChapterViewEditorComponent;
