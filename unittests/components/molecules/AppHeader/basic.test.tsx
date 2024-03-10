import AppHeader from '@/components/molecules/AppHeader';

import { render } from '@testing-library/react';

test('should show the app name and login button when user logged out', () => {
  const screen = render(<AppHeader authorized={false} />);
  expect(screen.queryByText('kNODEledge')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/api/auth/login');
});

test('should show the app name, E-mail address and logout button when user logged in', () => {
  const screen = render(<AppHeader authorized={true} username="dev@knodeledge.run.app" />);
  expect(screen.queryByText('kNODEledge')).toBeInTheDocument();
  expect(screen.queryByText('dev@knodeledge.run.app')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', '/api/auth/logout');
});
