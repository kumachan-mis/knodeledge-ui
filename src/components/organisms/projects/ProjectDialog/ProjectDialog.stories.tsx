import ProjectDialogComponent from './ProjectDialog';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectDialogComponent> = {
  component: ProjectDialogComponent,
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/require-await
    onSubmit: async () => {
      return { state: 'success', error: null };
    },
    onClose: () => {
      // Do nothing
    },
  },
  parameters: {
    docs: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectDialogComponent>;

export const Create: Story = {
  args: {
    title: 'Create Project',
    submitText: 'Create',
  },
};

export const Update: Story = {
  args: {
    title: 'Update Project',
    submitText: 'Update',
  },
};

export const ServerError: Story = {
  args: {
    title: 'Server Error',
    submitText: 'Submit',
    // eslint-disable-next-line @typescript-eslint/require-await
    onSubmit: async () => {
      return {
        state: 'error',
        error: { name: 'project name server error', description: 'project description server error' },
      };
    },
  },
};
