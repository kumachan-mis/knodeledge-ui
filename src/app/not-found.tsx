import AppLayout from '@/components/layouts/AppLayout';
import NotFoundError from '@/components/organisms/error/NotFoundError';

import { NextPage } from 'next';

const NotFoundPage: NextPage = () => (
  <AppLayout>
    <NotFoundError />
  </AppLayout>
);

export default NotFoundPage;
