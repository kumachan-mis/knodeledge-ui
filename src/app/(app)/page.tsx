import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { NextPage } from 'next';
import Link from 'next/link';

const HomePage: NextPage = () => (
  <Container maxWidth="lg" sx={{ my: 6 }}>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button LinkComponent={Link} color="primary" href="/projects" variant="contained">
        Open Project
      </Button>
    </Box>
  </Container>
);

export default HomePage;
