import { ENVIRONMENT } from '@/utils/env';

import { ThemeOptions, createTheme } from '@mui/material/styles';

let themeOptions: ThemeOptions = {};

if (ENVIRONMENT === 'storybook') {
  themeOptions = {
    ...themeOptions,
    components: {
      ...themeOptions.components,
      MuiAppBar: {
        ...themeOptions.components?.MuiAppBar,
        defaultProps: {
          ...themeOptions.components?.MuiAppBar?.defaultProps,
          position: 'static',
        },
      },
      MuiCircularProgress: {
        ...themeOptions.components?.MuiCircularProgress,
        defaultProps: {
          ...themeOptions.components?.MuiCircularProgress?.defaultProps,
          variant: 'determinate',
          value: 30,
        },
      },
      MuiLinearProgress: {
        ...themeOptions.components?.MuiLinearProgress,
        defaultProps: {
          ...themeOptions.components?.MuiLinearProgress?.defaultProps,
          variant: 'determinate',
          value: 30,
        },
      },
    },
  };
}

export const theme = createTheme(themeOptions);
