import AppError from '.';

import Button from '@mui/material/Button';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof AppError> = {
  component: AppError,
};

export default meta;

type Story = StoryObj<typeof AppError>;

export const NotFound: Story = {
  args: {
    action: <Button variant="contained">Go to home</Button>,
    message: 'Page not found',
    statusCode: 404,
  },
};

export const Unauthorized: Story = {
  args: {
    action: <Button variant="contained">Login</Button>,
    message: 'Unauthorized',
    statusCode: 401,
  },
};
