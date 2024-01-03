import AppHeader from '@/components/organisms/AppHeader';

import { render } from '@testing-library/react';

test('should show the app name "kNODEledge" and login button', () => {
  const screen = render(<AppHeader />);
  expect(screen.queryByText('kNODEledge')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
});
