import UnauthorizedErrorComponent from './UnauthorizedError';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UnauthorizedErrorComponent> = {
  component: UnauthorizedErrorComponent,
};

export default meta;

type Story = StoryObj<typeof UnauthorizedErrorComponent>;

export const Basic: Story = {};
