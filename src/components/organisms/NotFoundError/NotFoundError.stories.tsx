import NotFoundErrorComponent from './NotFoundError';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NotFoundErrorComponent> = {
  component: NotFoundErrorComponent,
};

export default meta;

type Story = StoryObj<typeof NotFoundErrorComponent>;

export const Basic: Story = {};
