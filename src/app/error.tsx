'use client';
import ErrorLayout from '@/components/layouts/ErrorLayout';
import InternalError from '@/components/organisms/InternalError';

import { NextPage } from 'next';

const GlobalErrorPage: NextPage = () => (
  <ErrorLayout>
    <InternalError />
  </ErrorLayout>
);

export default GlobalErrorPage;
