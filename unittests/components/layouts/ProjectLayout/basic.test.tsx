import { USER } from '../../../testutils/user';
import ProjectLayout from '@/components/layouts/ProjectLayout/ProjectLayout';

import { render } from '@testing-library/react';

test('should show the app name, user name and logout button', () => {
  const screen = render(<ProjectLayout user={USER} />);
  expect(screen.getByRole('link', { name: 'kNODEledge' })).toHaveAttribute('href', '/');
  expect(screen.queryByText('Test User')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', '/api/auth/logout');
});
