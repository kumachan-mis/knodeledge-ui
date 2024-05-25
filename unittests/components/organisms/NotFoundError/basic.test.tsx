import NotFoundError from '@/components/organisms/NotFoundError';

import { render } from '@testing-library/react';

test('should show 404, message, description and button to go back home', () => {
  const screen = render(<NotFoundError />);
  expect(screen.getByText('404')).toBeInTheDocument();
  expect(screen.getByText('Not Found')).toBeInTheDocument();
  expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute('href', '/');
});
