import '@testing-library/jest-dom';

process.env = {
  ...process.env,
  NEXT_PUBLIC_ENVIRONMENT: 'unittest',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
};
