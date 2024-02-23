import { USER } from '../../../../testutils/user';
import AppHeaderComponent from '@/components/organisms/app/AppHeader/AppHeader';

import { render } from '@testing-library/react';

test('should show the app name and login button when user logged out', () => {
  const screen = render(<AppHeaderComponent user={undefined} />);
  expect(screen.queryByText('kNODEledge')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/api/auth/login');
});

test('should show the app name, E-mail address and logout button when user logged in', () => {
  const screen = render(<AppHeaderComponent user={USER} />);
  expect(screen.queryByText('kNODEledge')).toBeInTheDocument();
  expect(screen.queryByText(USER.email)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', '/api/auth/logout');
});
