import SectionListComponent from './SectionList';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SectionListComponent> = {
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
