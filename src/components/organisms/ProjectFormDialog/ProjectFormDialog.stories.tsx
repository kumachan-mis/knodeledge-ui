import ProjectFormDialogComponent from './ProjectFormDialog';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ProjectFormDialogComponent> = {
  component: ProjectFormDialogComponent,
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

type Story = StoryObj<typeof ProjectFormDialogComponent>;

export const Create: Story = {
  args: {
    title: 'New Project',
    submitText: 'Create Project',
    defaultValues: { name: '', description: '' },
  },
};

export const Update: Story = {
  args: {
    title: 'Update Project',
    submitText: 'Save Changes',
    defaultValues: { name: 'project name', description: 'project description' },
  },
};

export const ServerError: Story = {
  args: {
    title: 'Server Error',
    submitText: 'Submit',
    defaultValues: { name: '', description: '' },
    // eslint-disable-next-line @typescript-eslint/require-await
    onSubmit: async () => {
      return {
        state: 'error',
        error: {
          message: 'server error',
          project: { name: 'project name error', description: 'project description error' },
        },
      };
    },
  },
};
