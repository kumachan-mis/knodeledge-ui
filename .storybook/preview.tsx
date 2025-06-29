import { theme } from '../src/components/theme';

import { ThemeProvider } from '@mui/material/styles';
import { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],

  tags: ['autodocs']
};

export default preview;
