import AppLayout from '@/components/layouts/AppLayout';
import { PROJECTS_ID_PATH_NAME } from '@/utils/page';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { NextPage } from 'next';
import Link from 'next/link';

const HomePage: NextPage = () => (
  <AppLayout>
    <Container maxWidth="lg" sx={{ my: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button LinkComponent={Link} color="primary" href={`/${PROJECTS_ID_PATH_NAME}`} variant="contained">
          Open Project
        </Button>
      </Box>
    </Container>
  </AppLayout>
);

export default HomePage;
