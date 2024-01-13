import { createOkResponse } from '../../testUtils';
import HelloWorldClientView from '@/components/organisms/HelloWorldClientView';

import { render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  (global.fetch as jest.Mock).mockRestore();
});

test('should show message from Hello World API', async () => {
  global.fetch = (global.fetch as jest.Mock).mockReturnValueOnce(
    Promise.resolve(createOkResponse({ message: 'Hello, testuser#0!' })),
  );

  const screen = render(<HelloWorldClientView user={{ name: 'testuser' }} />);

  expect(screen.queryByText('loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Hello, testuser#0!')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/hello-world`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'testuser#0' }) }),
  );
});

test('should update message when COUNT UP button click', async () => {
  global.fetch = (global.fetch as jest.Mock)
    .mockReturnValueOnce(Promise.resolve(createOkResponse({ message: 'Hello, testuser#0!' })))
    .mockReturnValueOnce(Promise.resolve(createOkResponse({ message: 'Hello, testuser#1!' })));

  const user = userEvent.setup();

  const screen = render(<HelloWorldClientView user={{ name: 'testuser' }} />);

  expect(screen.queryByText('loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Hello, testuser#0!')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/hello-world`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'testuser#0' }) }),
  );

  await user.click(screen.getByRole('button', { name: 'count up' }));

  await waitFor(() => {
    expect(screen.queryByText('Hello, testuser#1!')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/hello-world`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'testuser#1' }) }),
  );
});
