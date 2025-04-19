import { StarGraphChildWithId } from '@/components/libs/StarGraph/context';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React from 'react';

export type AppGraphChildInspectorProps = {
  readonly graphChild: StarGraphChildWithId;
  readonly setGraphChild: React.Dispatch<React.SetStateAction<StarGraphChildWithId>>;
};

const AppGraphChildInspector: React.FC<AppGraphChildInspectorProps> = ({ graphChild, setGraphChild }) => (
  <Grid container my={1} spacing={1}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <TextField
        fullWidth
        label="Name"
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
        label="Relation"
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
        label="Description"
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

export default AppGraphChildInspector;
