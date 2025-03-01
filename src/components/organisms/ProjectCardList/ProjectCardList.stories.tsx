import ProjectCardListComponent from './ProjectCardList';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectCardListComponent> = {
  component: ProjectCardListComponent,
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onUpdateProject: async () => {
      return { state: 'success', error: null };
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    onDeleteProject: async () => {
      return { state: 'success', error: null };
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectCardListComponent>;

export const Basic: Story = {
  args: {
    projectList: [
      {
        id: 'PROJECT_WITHOUT_DESCRIPTION',
        name: 'Project Without Description',
      },
      {
        id: 'PROJECT_WITH_DESCRIPTION',
        name: 'Project With Description',
        description: 'This is my project.',
      },
      {
        id: 'PROJECT_WITH_LONG_DESCRIPTION',
        name: 'Project With Long Description',
        description: [
          "My project's description is very long.",
          "It's so long that it's hard to fit it in a single line.",
          "This long description is a good test for the component's layout.",
          "This long description is a good test for the component's layout.",
          "This long description is a good test for the component's layout.",
          "This long description is a good test for the component's layout.",
        ].join(' '),
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    projectList: [],
  },
};
