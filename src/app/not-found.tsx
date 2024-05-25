import AppLayout from '@/components/layouts/AppLayout';
import NotFoundError from '@/components/organisms/NotFoundError';

import { NextPage } from 'next';

const NotFoundPage: NextPage = () => (
  <AppLayout>
    <NotFoundError />
  </AppLayout>
);

export default NotFoundPage;
