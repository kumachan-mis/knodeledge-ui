import PanicErrorComponent from './PanicError';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PanicErrorComponent> = {
  component: PanicErrorComponent,
  parameters: {
    docs: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof PanicErrorComponent>;

export const Panic: Story = {
  args: {
    panic: {
      state: 'panic',
      message: 'This is a panic message',
    },
  },
};

export const Healthy: Story = {
  args: {
    panic: {
      state: 'healthy',
      message: null,
    },
  },
};
