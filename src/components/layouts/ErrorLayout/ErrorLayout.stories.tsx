import ErrorLayout from './ErrorLayout';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ErrorLayout> = {
  component: ErrorLayout,
};

export default meta;

type Story = StoryObj<typeof ErrorLayout>;

export const Basic: Story = {};
