'use client';
import { theme } from '@/components/theme';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { EditorRoot, EditorSyntaxMenu, Divider, EditorTextFieldRoot, EditorTextFieldBody } from 'react-clay-editor';

import 'katex/dist/katex.min.css';

export type AppEditorProps = {
  readonly text: string;
  readonly setText: React.Dispatch<React.SetStateAction<string>>;
  readonly state: 'notfound' | 'loading' | 'success';
};

const AppEditor: React.FC<AppEditorProps> = ({ text, setText, state }) => (
  <AppEditorRoot setText={setText} text={text}>
    <EditorSyntaxMenu />
    <Divider />
    {state !== 'success' ? (
      // ThemeProvider is a workaround to use MUI inside the editor
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {state === 'loading' && <CircularProgress />}
        </Box>
      </ThemeProvider>
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
