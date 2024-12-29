'use client';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import React from 'react';
import { EditorRoot, EditorSyntaxMenu, Divider, EditorTextFieldRoot, EditorTextFieldBody } from 'react-clay-editor';
import 'katex/dist/katex.min.css';

export type AppEditorProps = {
  readonly text: string;
  readonly setText: React.Dispatch<React.SetStateAction<string>>;
  readonly loading?: boolean;
};

const AppEditor: React.FC<AppEditorProps> = ({ text, setText, loading }) => (
  <AppEditorRoot setText={setText} text={text}>
    <EditorSyntaxMenu />
    <Divider />
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    ) : (
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    )}
  </AppEditorRoot>
);

const AppEditorRoot = styled(EditorRoot)({
  '&&': {
    width: '100%',
    flexGrow: 1,
  },
});

export default AppEditor;
