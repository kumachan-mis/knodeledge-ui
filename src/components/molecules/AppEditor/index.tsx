'use client';
import { theme } from '@/components/theme';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { styled, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import {
  EditorRoot,
  EditorSyntaxMenu,
  Divider,
  EditorTextFieldRoot,
  EditorTextFieldBody,
  EditorRootProps,
} from 'react-clay-editor';

import 'katex/dist/katex.min.css';

export type AppEditorProps = EditorRootProps & {
  readonly state: 'notfound' | 'loading' | 'success';
  readonly view: 'paper' | 'article' | 'graph';
};

const AppEditor: React.FC<AppEditorProps> = ({ state, view, ...rest }) => (
  <AppEditorRoot view={view} {...rest}>
    {view !== 'graph' && (
      <>
        <EditorSyntaxMenu />
        <Divider />
      </>
    )}
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

const AppEditorRoot = styled<React.FC<EditorRootProps & { view: 'paper' | 'article' | 'graph' }>>(EditorRoot)(
  ({ view }) => ({
    '&&': {
      width: '100%',
      height: view !== 'graph' ? '100%' : '20%',
    },
  }),
);

export default AppEditor;
