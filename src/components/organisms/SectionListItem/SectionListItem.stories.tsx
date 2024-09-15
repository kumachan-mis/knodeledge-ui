import SectionListItemComponent from './SectionListItem';

import List from '@mui/material/List';
import { Meta } from '@storybook/react';

const meta: Meta<typeof SectionListItemComponent> = {
  component: SectionListItemComponent,
  decorators: [
    (Story) => (
      <List>
        <Story />
      </List>
    ),
  ],
};

export default meta;

export const Basic = {
  args: {
    section: {
      id: 'SECTION_ONE',
      name: 'Section One',
    },
  },
};
