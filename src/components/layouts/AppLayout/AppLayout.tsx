'use client';
import AppContainer from '@/components/molecules/AppContainer';
import AppHeader from '@/components/molecules/AppHeader';
import AppMain from '@/components/molecules/AppMain';
import { useMenu } from '@/hooks/menu';

import { User } from '@auth0/nextjs-auth0/types';

export type AppLayoutComponentProps = {
  readonly user: User | undefined;
  readonly children?: React.ReactNode;
};

const AppLayoutComponent: React.FC<AppLayoutComponentProps> = ({ user, children }) => {
  const {
    open: mobileAccountMenuOpen,
    anchorEl: mobileAccountMenuAnchorEl,
    onOpen: onOpenMobileAccountMenu,
    onClose: onCloseMobileAccountMenu,
  } = useMenu();

  return (
    <AppContainer>
      <AppHeader
        authorized={!!user}
        mobileAccountMenuAnchorEl={mobileAccountMenuAnchorEl}
        mobileAccountMenuOpen={mobileAccountMenuOpen}
        onCloseMobileAccountMenu={onCloseMobileAccountMenu}
        onOpenMobileAccountMenu={onOpenMobileAccountMenu}
        username={user?.name}
      />
      <AppMain>{children}</AppMain>
    </AppContainer>
  );
};

export default AppLayoutComponent;
