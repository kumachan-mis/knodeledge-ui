import { LoadableAction } from '@/contexts/openapi';
import { LoadablePaper, PaperActionError } from '@/contexts/papers';
import { PaperWithoutAutofield } from '@/openapi';

import PaperEditorComponent from './PaperEditor';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import React from 'react';

export type PaperViewComponentProps = {
  readonly loadablePaper: LoadablePaper;
  readonly updatePaper: (id: string, paper: PaperWithoutAutofield) => Promise<LoadableAction<PaperActionError>>;
};

const PaperViewComponent: React.FC<PaperViewComponentProps> = ({ loadablePaper, updatePaper }) =>
  loadablePaper.state === 'loading' ? (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" p={12}>
        <CircularProgress />
      </Box>
    </Container>
  ) : (
    loadablePaper.state === 'success' && (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <PaperEditorComponent paper={loadablePaper.data} updatePaper={updatePaper} />
      </Container>
    )
  );

export default PaperViewComponent;
