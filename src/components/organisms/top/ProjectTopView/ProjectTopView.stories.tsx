import ProjectTopViewComponent from './ProjectTopView';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProjectTopViewComponent> = {
  component: ProjectTopViewComponent,
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onUpdateProject: async () => {
      return { state: 'success', error: null };
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectTopViewComponent>;

export const WithoutDescription: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
        id: 'PROJECT_WITHOUT_DESCRIPTION',
        name: 'Project Without Description',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
        id: 'PROJECT_WITH_DESCRIPTION',
        name: 'Project With Description',
        description: 'This is my project.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    loadableProject: {
      state: 'success',
      data: {
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
  },
};

export const Loading: Story = {
  args: {
    loadableProject: {
      state: 'loading',
      data: null,
    },
  },
};
