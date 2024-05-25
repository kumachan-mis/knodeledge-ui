import InternalError from '@/components/organisms/InternalError';

import { render } from '@testing-library/react';

test('should show 500, message, description and button to go back home', () => {
  const screen = render(<InternalError />);
  expect(screen.getByText('500')).toBeInTheDocument();
  expect(screen.getByText('Internal Error')).toBeInTheDocument();
  expect(screen.getByText('An internal error occurred. Please try again later.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute('href', '/');
});
