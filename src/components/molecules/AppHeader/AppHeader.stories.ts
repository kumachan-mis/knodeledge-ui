import AppHeader from '.';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AppHeader> = {
  component: AppHeader,
};

export default meta;

type Story = StoryObj<typeof AppHeader>;

export const Login: Story = {
  args: {
    authorized: false,
    username: '',
  },
};

export const Logout: Story = {
  args: {
    authorized: true,
    username: 'dev@knodeledge.run.app',
  },
};
