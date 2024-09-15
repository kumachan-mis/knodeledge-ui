import AppError from '@/components/molecules/AppError';

import Button from '@mui/material/Button';
import Link from 'next/link';

const NotFoundErrorComponent: React.FC = () => (
  <AppError
    action={
      <Button LinkComponent={Link} href="/" variant="contained">
        Go to home
      </Button>
    }
    description="The page you are looking for does not exist."
    message="Not Found"
    statusCode={404}
  />
);

export default NotFoundErrorComponent;
