import AppHeaderComponent from './AppHeader';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AppHeaderComponent> = {
  component: AppHeaderComponent,
};

export default meta;

type Story = StoryObj<typeof AppHeaderComponent>;

export const Basic: Story = {
  args: {},
};
