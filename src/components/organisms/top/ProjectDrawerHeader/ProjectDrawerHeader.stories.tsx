import ProjectDrawerHeaderComponent from './ProjectDrawerHeader';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectDrawerHeaderComponent> = {
  component: ProjectDrawerHeaderComponent,
};

export default meta;

type Story = StoryObj<typeof ProjectDrawerHeaderComponent>;

export const Basic: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
        id: 'PROJECT',
        name: 'Project',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    loadableProject: {
      state: 'loading',
      data: null,
    },
  },
};

export const NotFound: Story = {
  args: {
    loadableProject: {
      state: 'notfound',
      data: null,
    },
  },
};
