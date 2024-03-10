import ProjectToolbarComponent from './ProjectToolbar';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectToolbarComponent> = {
  component: ProjectToolbarComponent,
};

export default meta;

type Story = StoryObj<typeof ProjectToolbarComponent>;

export const Basic: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onCreateProject: async () => {
      return { state: 'success', error: null };
    },
  },
};
