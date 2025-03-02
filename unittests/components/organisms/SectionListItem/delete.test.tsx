import SectionListItem from '@/components/organisms/SectionListItem';

import { render, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('should delete section', async () => {
  const user = userEvent.setup();

  const deleteSection = jest.fn().mockResolvedValueOnce({ state: 'success', error: null });

  const screen = render(
    <SectionListItem
      chapterId="CHAPTER"
      onDeleteSection={deleteSection}
      projectId="PROJECT"
      section={{
        id: 'SECTION',
        name: 'Section Name',
      }}
    />,
  );

  await user.click(screen.getByLabelText('section menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Section'));

  expect(deleteSection).toHaveBeenCalledTimes(1);
});

test('should show error when failed to delete section', async () => {
  const user = userEvent.setup();

  const deleteSection = jest.fn().mockResolvedValueOnce({
    state: 'error',
    error: { message: 'root error', user: {}, project: {}, section: {} },
  });

  const screen = render(
    <SectionListItem
      chapterId="CHAPTER"
      onDeleteSection={deleteSection}
      projectId="PROJECT"
      section={{
        id: 'SECTION',
        name: 'Section Name',
      }}
    />,
  );

  await user.click(screen.getByLabelText('section menu'));

  const menu = within(await screen.findByRole('menu'));

  await user.click(menu.getByText('Delete Section'));

  await waitFor(() => {
    expect(screen.queryByText('root error')).toBeInTheDocument();
  });

  expect(deleteSection).toHaveBeenCalledTimes(1);
});
