'use client';
import AppContainer from '@/components/molecules/AppContainer';
import AppHeader from '@/components/molecules/AppHeader';
import AppMain from '@/components/molecules/AppMain';
import { useMenu } from '@/hooks/menu';

import { User } from '@auth0/nextjs-auth0/types';

export type ErrorLayoutComponentProps = {
  readonly children?: React.ReactNode;
};

const ErrorLayoutComponent: React.FC<ErrorLayoutComponentProps> = ({ children }) => {
  const {
    open: mobileAccountMenuOpen,
    anchorEl: mobileAccountMenuAnchorEl,
    onOpen: onOpenMobileAccountMenu,
    onClose: onCloseMobileAccountMenu,
  } = useMenu();

  return (
    <AppContainer>
      <AppHeader
        userstate="error"
        mobileAccountMenuAnchorEl={mobileAccountMenuAnchorEl}
        mobileAccountMenuOpen={mobileAccountMenuOpen}
        onCloseMobileAccountMenu={onCloseMobileAccountMenu}
        onOpenMobileAccountMenu={onOpenMobileAccountMenu}
      />
      <AppMain>{children}</AppMain>
    </AppContainer>
  );
};

export default ErrorLayoutComponent;
