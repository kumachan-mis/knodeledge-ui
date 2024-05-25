import { Panic } from '@/contexts/openapi';

import ErrorIcon from '@mui/icons-material/Error';
import Backdrop from '@mui/material/Backdrop';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

export type PanicErrorComponentProps = {
  readonly panic: Panic;
};

const PanicErrorComponent: React.FC<PanicErrorComponentProps> = ({ panic }) => (
  <Backdrop open={panic.state === 'panic'} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Dialog fullWidth maxWidth="sm" open={panic.state === 'panic'}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <ErrorIcon color="error" sx={{ mr: 2 }} />
        Fatal Error Occured
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{panic.message}</DialogContentText>
      </DialogContent>
    </Dialog>
  </Backdrop>
);

export default PanicErrorComponent;
