import { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testTimeout: 10 * 1000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

module.exports = async () => {
  const config = (await createJestConfig(customJestConfig)()) as Config;
  config.transformIgnorePatterns = ['node_modules/(?!(d3-.*)/)'];
  return config;
};
