import SectionListComponent from './SectionList';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof SectionListComponent> = {
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onDeleteSection: async () => {
      return { state: 'success', error: null };
    },
  },
  component: SectionListComponent,
};

export default meta;

type Story = StoryObj<typeof SectionListComponent>;

export const Basic: Story = {
  args: {
    projectId: 'PROJECT_ONE',
    chapterId: 'CHAPTER_ONE',
    sections: [
      {
        id: 'SECTION_ONE',
        name: 'Section One',
      },
      {
        id: 'SECTION_TWO',
        name: 'Section Two',
      },
    ],
  },
};
