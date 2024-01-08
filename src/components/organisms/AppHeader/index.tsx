import AppHeaderComponent from './AppHeader';

import { getSession } from '@auth0/nextjs-auth0';

const AppHeader: React.FC = async () => {
  const session = await getSession();
  return <AppHeaderComponent user={session?.user} />;
};

export default AppHeader;
