import ProjectViewComponent from './ProjectView';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ProjectViewComponent> = {
  component: ProjectViewComponent,
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onUpdateProject: async () => {
      return { state: 'success', error: null };
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectViewComponent>;

export const WithoutDescription: Story = {
  args: {
    project: {
      id: 'PROJECT_WITHOUT_DESCRIPTION',
      name: 'Project Without Description',
    },
  },
};

export const WithDescription: Story = {
  args: {
    project: {
      id: 'PROJECT_WITH_DESCRIPTION',
      name: 'Project With Description',
      description: 'This is my project.',
    },
  },
};

export const LongDescription: Story = {
  args: {
    project: {
      id: 'PROJECT_WITH_LONG_DESCRIPTION',
      name: 'Project With Long Description',
      description: [
        "My project's description is very long.",
        "It's so long that it's hard to fit it in a single line.",
        "This long description is a good test for the component's layout.",
        "This long description is a good test for the component's layout.",
      ].join(' '),
    },
  },
};
