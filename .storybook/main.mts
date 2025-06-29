import { createRequire } from 'node:module';
import { StorybookConfig } from '@storybook/react-vite';
import path, { dirname, join } from 'node:path';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-docs')],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
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
      plugins: [react()],
    }),
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
