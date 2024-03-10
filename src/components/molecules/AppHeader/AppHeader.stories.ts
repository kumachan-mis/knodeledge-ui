import AppHeaderComponent from '.';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AppHeaderComponent> = {
  component: AppHeaderComponent,
};

export default meta;

type Story = StoryObj<typeof AppHeaderComponent>;

export const Login: Story = {
  args: {
    authorized: false,
    userName: '',
  },
};

export const Logout: Story = {
  args: {
    authorized: true,
    userName: 'dev@knodeledge.run.app',
  },
};
