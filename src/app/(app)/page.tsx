import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { NextPage } from 'next';
import Link from 'next/link';

const HomePage: NextPage = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <Button LinkComponent={Link} color="primary" href="/projects" variant="contained">
      Open Project
    </Button>
  </Box>
);

export default HomePage;
