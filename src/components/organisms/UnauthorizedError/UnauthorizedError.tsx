import AppError from '@/components/molecules/AppError';

import Button from '@mui/material/Button';

const UnauthorizedErrorComponent: React.FC = () => (
  <AppError
    action={
      <Button href="/api/auth/login" variant="contained">
        Login
      </Button>
    }
    description="You are not authorized to access this page. Please login."
    message="Unauthorized"
    statusCode={401}
  />
);

export default UnauthorizedErrorComponent;
