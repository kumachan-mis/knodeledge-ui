import AppLayout from './AppLayout';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AppLayout> = {
  component: AppLayout,
};

export default meta;

type Story = StoryObj<typeof AppLayout>;

export const Login: Story = {
  args: {
    user: {
      sub: 'auth0|1234567890',
      name: 'Developer',
      email: 'dev@knodeledge.run.app',
    },
  },
};

export const Logout: Story = {
  args: {
    user: undefined,
  },
};
