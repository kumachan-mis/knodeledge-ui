import ProjectLayout from './ProjectLayout';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectLayout> = {
  component: ProjectLayout,
};

export default meta;

type Story = StoryObj<typeof ProjectLayout>;

export const Basic: Story = {
  args: {
    user: {
      sub: 'auth0|1234567890',
      name: 'Developer',
      email: 'dev@knodeledge.run.app',
    },
  },
};
