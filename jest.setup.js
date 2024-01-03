import '@testing-library/jest-dom';

process.env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: 'http://localhost:8080',
};
