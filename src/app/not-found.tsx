import AppLayout from '@/components/layouts/AppLayout';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';
import Link from 'next/link';

const NotFoundPage: NextPage = () => (
  <AppLayout>
    <Typography my={8} textAlign="center" variant="h1">
      404
    </Typography>
    <Typography my={6} textAlign="center" variant="h3">
      Page Not Found
    </Typography>
    <Box sx={{ my: 6, display: 'flex', justifyContent: 'center' }}>
      <Button LinkComponent={Link} href="/" variant="contained">
        Go to Home
      </Button>
    </Box>
  </AppLayout>
);

export default NotFoundPage;
