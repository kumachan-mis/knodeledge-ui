import AppHeaderComponent from './AppHeader';

import { Claims } from '@auth0/nextjs-auth0/edge';
import { SxProps, Theme } from '@mui/material/styles';

export type AppHeaderProps = {
  readonly user: Claims | undefined;
  readonly sx?: SxProps<Theme>;
  readonly AppHeaderMenu?: React.FC<{ user: Claims | undefined }>;
};

const AppHeader: React.FC<AppHeaderProps> = (props) => {
  return <AppHeaderComponent {...props} />;
};

export default AppHeader;
