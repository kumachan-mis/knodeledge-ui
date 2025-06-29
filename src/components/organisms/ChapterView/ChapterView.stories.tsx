import ChapterViewComponent from './ChapterView';

import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ChapterViewComponent> = {
  component: ChapterViewComponent,
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    onUpdatePaper: async () => {
      return { state: 'success', error: null };
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    onSectionalizePaper: async () => {
      return { state: 'success', error: null };
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChapterViewComponent>;

export const Basic: Story = {
  args: {
    project: {
      id: 'PROJECT',
      name: 'Project Name',
    },
    chapter: {
      id: 'CHAPTER',
      name: 'Chapter Name',
      number: 1,
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
    loadablePaper: {
      state: 'success',
      data: {
        id: 'PAPER',
        content: 'This is paper content.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    ...Basic.args,
    loadablePaper: {
      state: 'loading',
      data: null,
    },
  },
};

export const NotFound: Story = {
  args: {
    ...Basic.args,
    loadablePaper: {
      state: 'notfound',
      data: null,
    },
  },
};
