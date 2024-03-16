import { USER } from '../../../testutils/user';
import AppLayout from '@/components/layouts/AppLayout/AppLayout';

import { render } from '@testing-library/react';

test('should show the app name and login button when user logged out', () => {
  const screen = render(<AppLayout user={undefined} />);
  expect(screen.queryByText('kNODEledge')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/api/auth/login');
});

test('should show the app name, E-mail address and logout button when user logged in', () => {
  const screen = render(<AppLayout user={USER} />);
  expect(screen.queryByText('kNODEledge')).toBeInTheDocument();
  expect(screen.queryByText('Test User')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', '/api/auth/logout');
});
