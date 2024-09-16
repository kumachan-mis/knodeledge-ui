'use client';
import { usePaperContent, useSetPaperContent } from '@/contexts/views';

import { styled } from '@mui/material/styles';
import { EditorRoot, EditorSyntaxMenu, Divider, EditorTextFieldRoot, EditorTextFieldBody } from 'react-clay-editor';
import 'katex/dist/katex.min.css';

const ChapterViewEditorComponent: React.FC = () => {
  const content = usePaperContent();
  const setContent = useSetPaperContent();

  return (
    <ChapterViewEditorRoot setText={setContent} text={content}>
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
