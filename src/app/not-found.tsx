import AppLayout from '@/components/layouts/AppLayout';
import AppError from '@/components/molecules/AppError';

import Button from '@mui/material/Button';
import { NextPage } from 'next';
import Link from 'next/link';

const NotFoundPage: NextPage = () => (
  <AppLayout>
    <AppError
      action={
        <Button LinkComponent={Link} href="/" variant="contained">
          Go to home
        </Button>
      }
      message="Page not found"
      statusCode={404}
    />
  </AppLayout>
);

export default NotFoundPage;
