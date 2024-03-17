import PanicErrorComponent from '@/components/organisms/error/PanicError/PanicError';

import { render } from '@testing-library/react';

test('should hide when the application is healthy', () => {
  const { queryByText } = render(<PanicErrorComponent panic={{ state: 'healthy', message: null }} />);
  expect(queryByText('Fatal Error Occured')).not.toBeInTheDocument();
});

test('should show a message when the application is in panic', () => {
  const { getByText } = render(<PanicErrorComponent panic={{ state: 'panic', message: 'Panic message' }} />);
  expect(getByText('Fatal Error Occured')).toBeInTheDocument();
  expect(getByText('Panic message')).toBeInTheDocument();
});
