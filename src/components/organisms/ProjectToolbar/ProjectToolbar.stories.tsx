import ProjectToolbarComponent from './ProjectToolbar';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ProjectToolbarComponent> = {
  component: ProjectToolbarComponent,
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onCreateProject: async () => {
      return { state: 'success', error: null };
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectToolbarComponent>;

export const Basic: Story = {};
