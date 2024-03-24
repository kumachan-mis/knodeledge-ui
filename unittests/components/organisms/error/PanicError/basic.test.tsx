import PanicErrorComponent from '@/components/organisms/error/PanicError/PanicError';

import { render } from '@testing-library/react';

test('should hide when the application is healthy', () => {
  const screen = render(<PanicErrorComponent panic={{ state: 'healthy', message: null }} />);
  expect(screen.queryByText('Fatal Error Occured')).not.toBeInTheDocument();
});

test('should show a message when the application is in panic', () => {
  const screen = render(<PanicErrorComponent panic={{ state: 'panic', message: 'Panic message' }} />);
  expect(screen.getByText('Fatal Error Occured')).toBeInTheDocument();
  expect(screen.getByText('Panic message')).toBeInTheDocument();
});
