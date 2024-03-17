import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

export type AppErrorProps = {
  readonly statusCode: number;
  readonly message: string;
  readonly description: string;
  readonly action: React.ReactNode;
};

const AppError: React.FC<AppErrorProps> = ({ statusCode, message, description, action }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography my={8} variant="h1">
      {statusCode}
    </Typography>
    <Typography mt={4} variant="h3">
      {message}
    </Typography>
    <Typography mt={2} variant="body1">
      {description}
    </Typography>
    <Box sx={{ my: 6 }}>{action}</Box>
  </Box>
);

export default AppError;
