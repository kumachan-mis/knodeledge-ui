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
} else if (ENVIRONMENT === 'unittest') {
  themeOptions = {
    ...themeOptions,
    transitions: {
      ...themeOptions.transitions,
      create: () => 'none',
    },
    components: {
      ...themeOptions.components,
      MuiButtonBase: {
        ...themeOptions.components?.MuiButtonBase,
        defaultProps: {
          ...themeOptions.components?.MuiButtonBase?.defaultProps,
          disableRipple: true,
        },
      },
    },
  };
}

export const theme = createTheme(themeOptions);
