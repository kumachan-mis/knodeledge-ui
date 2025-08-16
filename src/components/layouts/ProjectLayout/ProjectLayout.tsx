'use client';
import AppContainer from '@/components/molecules/AppContainer';
import AppDrawer, { useAppDrawer } from '@/components/molecules/AppDrawer';
import AppDrawerHeader from '@/components/molecules/AppDrawerHeader';
import AppDrawerMain from '@/components/molecules/AppDrawerMain';
import { useMenu } from '@/hooks/menu';

import { User } from '@auth0/nextjs-auth0/types';

export type ProjectLayoutComponentProps = {
  readonly user: User | undefined;
  readonly projectId: string;
  readonly DrawerHeader?: React.FC<{
    readonly user: User;
    readonly projectId: string;
  }>;
  readonly DrawerContent?: React.FC<{
    readonly user: User;
    readonly projectId: string;
  }>;
  readonly children?: React.ReactNode;
};

const ProjectLayoutComponent: React.FC<ProjectLayoutComponentProps> = ({
  user,
  projectId,
  DrawerHeader,
  DrawerContent,
  children,
}) => {
  const {
    open: mobileAccountMenuOpen,
    anchorEl: mobileAccountMenuAnchorEl,
    onOpen: onOpenMobileAccountMenu,
    onClose: onCloseMobileAccountMenu,
  } = useMenu();
  const { mobileOpen, handleMobileClose, handleMobileToggle, handleMobileTransitionEnd } = useAppDrawer();

  return (
    <AppContainer>
      <AppDrawerHeader
        userstate={user ? 'authenticated' : 'unauthenticated'}
        mobileAccountMenuAnchorEl={mobileAccountMenuAnchorEl}
        mobileAccountMenuOpen={mobileAccountMenuOpen}
        onCloseMobileAccountMenu={onCloseMobileAccountMenu}
        onOpenMobileAccountMenu={onOpenMobileAccountMenu}
        onToggleMobileDrawer={handleMobileToggle}
        username={user?.name}
      />
      <AppDrawer
        header={user && DrawerHeader && <DrawerHeader projectId={projectId} user={user} />}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
        onMobileTransitionEnd={handleMobileTransitionEnd}
      >
        {user && DrawerContent && <DrawerContent projectId={projectId} user={user} />}
      </AppDrawer>
      <AppDrawerMain>{children}</AppDrawerMain>
    </AppContainer>
  );
};

export default ProjectLayoutComponent;
