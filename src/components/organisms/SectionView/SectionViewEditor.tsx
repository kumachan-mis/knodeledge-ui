'use client';
import { useGraphContent, useSetGraphContent } from '@/contexts/views';

import { styled } from '@mui/material/styles';
import React from 'react';
import { EditorRoot, EditorSyntaxMenu, Divider, EditorTextFieldRoot, EditorTextFieldBody } from 'react-clay-editor';
import 'katex/dist/katex.min.css';

const SectionViewEditorComponent: React.FC = () => {
  const graph = useGraphContent();
  const setGraph = useSetGraphContent();

  const setText = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (typeof value === 'function') {
        setGraph((prev) => ({ ...prev, paragraph: value(prev.paragraph) }));
        return;
      }
      setGraph({ paragraph: value });
    },
    [setGraph],
  );

  return (
    <SectionViewEditorRoot setText={setText} text={graph.paragraph}>
      <EditorSyntaxMenu />
      <Divider />
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </SectionViewEditorRoot>
  );
};

const SectionViewEditorRoot = styled(EditorRoot)({
  '&&': {
    width: '100%',
    flexGrow: 1,
  },
});

export default SectionViewEditorComponent;
