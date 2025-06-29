import InternalErrorComponent from './InternalError';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof InternalErrorComponent> = {
  component: InternalErrorComponent,
};

export default meta;

type Story = StoryObj<typeof InternalErrorComponent>;

export const Basic: Story = {};
