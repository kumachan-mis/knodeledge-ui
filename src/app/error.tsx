'use client';
import AppLayout from '@/components/layouts/AppLayout';
import InternalError from '@/components/organisms/InternalError';

import { NextPage } from 'next';

const GlobalErrorPage: NextPage = () => (
  <AppLayout>
    <InternalError />
  </AppLayout>
);

export default GlobalErrorPage;
