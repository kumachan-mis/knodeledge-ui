import AppToolbar from '@/components/molecules/AppToolbar';

import AppBar from '@mui/material/AppBar';

export type AppHeaderProps = {
  readonly userstate: 'authenticated' | 'unauthenticated';
  readonly username?: string;
  readonly mobileAccountMenuOpen: boolean;
  readonly mobileAccountMenuAnchorEl: HTMLElement | null;
  readonly onOpenMobileAccountMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly onCloseMobileAccountMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const AppHeader: React.FC<AppHeaderProps> = (props) => (
  <AppBar>
    <AppToolbar {...props} />
  </AppBar>
);

export default AppHeader;
