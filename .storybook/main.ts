import { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
      define: {
        'process.env': {
          NEXT_PUBLIC_ENVIRONMENT: 'storybook',
        },
      },
      plugins: [react({ jsxRuntime: 'automatic' })],
    }),
};
export default config;
