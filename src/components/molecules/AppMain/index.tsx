import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

export type AppMainProps = {
  readonly children: React.ReactNode;
};

const AppMain: React.FC<AppMainProps> = ({ children }) => (
  <Container component="main" maxWidth="lg" sx={{ my: 6 }}>
    <Toolbar variant="dense" />
    {children}
  </Container>
);

export default AppMain;
