import PaperViewComponent from './PaperView';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PaperViewComponent> = {
  component: PaperViewComponent,
};

export default meta;

type Story = StoryObj<typeof PaperViewComponent>;

export const Basic: Story = {};
