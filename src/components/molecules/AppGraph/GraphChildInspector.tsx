import GraphChildWithId from './GraphChildWithId';

import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import React from 'react';

export type GraphChildInspectorProps = {
  readonly graphChild: GraphChildWithId;
  readonly setGraphChild: React.Dispatch<React.SetStateAction<GraphChildWithId>>;
};

const GraphChildInspector: React.FC<GraphChildInspectorProps> = ({ graphChild, setGraphChild }) => (
  <Grid container my={1} spacing={1}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <TextField
        fullWidth
        onChange={(event) => {
          setGraphChild((prev) => ({ ...prev, name: event.target.value }));
        }}
        size="small"
        slotProps={{ input: { sx: { fontSize: '0.85rem' } } }}
        value={graphChild.name}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <TextField
        fullWidth
        onChange={(event) => {
          setGraphChild((prev) => ({ ...prev, relation: event.target.value }));
        }}
        size="small"
        slotProps={{ input: { sx: { fontSize: '0.85rem' } } }}
        value={graphChild.relation}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
      <TextField
        fullWidth
        onChange={(event) => {
          setGraphChild((prev) => ({ ...prev, description: event.target.value }));
        }}
        size="small"
        slotProps={{ input: { sx: { fontSize: '0.85rem' } } }}
        value={graphChild.description}
      />
    </Grid>
  </Grid>
);

export default GraphChildInspector;
