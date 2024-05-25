import AppError from '@/components/molecules/AppError';

import Button from '@mui/material/Button';
import Link from 'next/link';
import React from 'react';

const InternalErrorComponent: React.FC = () => (
  <AppError
    action={
      <Button LinkComponent={Link} href="/" variant="contained">
        Go to home
      </Button>
    }
    description="An internal error occurred. Please try again later."
    message="Internal Error"
    statusCode={500}
  />
);

export default InternalErrorComponent;
