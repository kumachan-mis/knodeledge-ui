import { fetchHelloWorld } from '@/actions/fetchHelloWorld';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const HelloWorldServerView: React.FC = async () => {
  const message = await fetchHelloWorld({ name: 'server' });
  return (
    <Box my={1}>
      <Typography variant="h6">Server Component</Typography>
      <Typography>{message}</Typography>
    </Box>
  );
};

export default HelloWorldServerView;
