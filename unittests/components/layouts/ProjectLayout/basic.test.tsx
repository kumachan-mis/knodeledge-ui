import { USER } from '../../../testutils/user';
import ProjectLayout from '@/components/layouts/ProjectLayout/ProjectLayout';

import { render } from '@testing-library/react';

test('should show the app name and login button when user logged out', () => {
  const screen = render(<ProjectLayout projectId="PROJECT" user={undefined} />);
  expect(screen.getByRole('link', { name: 'kNODEledge' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/auth/login');
});

test('should show the app name, user name and logout button', () => {
  const screen = render(<ProjectLayout projectId="PROJECT" user={USER} />);
  expect(screen.getByRole('link', { name: 'kNODEledge' })).toHaveAttribute('href', '/');
  expect(screen.queryAllByText('Test User')).toHaveLength(2);
  expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', '/auth/logout');
});
