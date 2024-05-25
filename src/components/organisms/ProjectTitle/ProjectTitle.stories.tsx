import ProjectTitleComponent from './ProjectTitle';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectTitleComponent> = {
  component: ProjectTitleComponent,
};

export default meta;

type Story = StoryObj<typeof ProjectTitleComponent>;

export const Basic: Story = {
  args: {
    children: 'PROJECTS',
  },
};
