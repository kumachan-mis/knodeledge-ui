import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export type AppErrorProps = {
  statusCode: number;
  message: string;
  action: React.ReactNode;
};

const AppError: React.FC<AppErrorProps> = ({ statusCode, message, action }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography my={8} variant="h1">
      {statusCode}
    </Typography>
    <Typography my={6} variant="h3">
      {message}
    </Typography>
    <Box sx={{ my: 6 }}>{action}</Box>
  </Box>
);

export default AppError;
