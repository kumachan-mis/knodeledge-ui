import UnauthorizedError from '@/components/organisms/UnauthorizedError';

import { render } from '@testing-library/react';

test('should show 401, message, description and button to log in', () => {
  const screen = render(<UnauthorizedError />);
  expect(screen.getByText('401')).toBeInTheDocument();
  expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  expect(screen.getByText('You are not authorized to access this page. Please login.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/api/auth/login');
});
