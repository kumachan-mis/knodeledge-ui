import { createOkResponse } from '../../testUtils';
import HelloWorldClientView from '@/components/organisms/HelloWorldClientView';
import { API_BASE_PATH } from '@/utils/openapi';

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
    Promise.resolve(createOkResponse({ message: 'Hello, client0!' })),
  );

  const screen = render(<HelloWorldClientView />);

  expect(screen.queryByText('loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Hello, client0!')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${API_BASE_PATH}/api/hello-world`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'client0' }) }),
  );
});

test('should update message when COUNT UP button click', async () => {
  global.fetch = (global.fetch as jest.Mock)
    .mockReturnValueOnce(Promise.resolve(createOkResponse({ message: 'Hello, client0!' })))
    .mockReturnValueOnce(Promise.resolve(createOkResponse({ message: 'Hello, client1!' })));

  const user = userEvent.setup();

  const screen = render(<HelloWorldClientView />);

  expect(screen.queryByText('loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Hello, client0!')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    `${API_BASE_PATH}/api/hello-world`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'client0' }) }),
  );

  await user.click(screen.getByRole('button', { name: 'count up' }));

  await waitFor(() => {
    expect(screen.queryByText('Hello, client1!')).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    `${API_BASE_PATH}/api/hello-world`,
    expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'client1' }) }),
  );
});
