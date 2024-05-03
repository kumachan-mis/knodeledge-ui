'use client';
import AppContainer from '@/components/molecules/AppContainer';
import AppDrawer, { useAppDrawer } from '@/components/molecules/AppDrawer';
import AppDrawerHeader from '@/components/molecules/AppDrawerHeader';
import AppDrawerMain from '@/components/molecules/AppDrawerMain';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ProjectLayoutComponentProps = {
  readonly user: Claims;
  readonly projectId: string;
  readonly DrawerHeader?: React.FC<{
    readonly user: Claims;
    readonly projectId: string;
  }>;
  readonly DrawerContent?: React.FC<{
    readonly user: Claims;
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
  const { mobileOpen, handleMobileClose, handleMobileToggle, handleMobileTransitionEnd } = useAppDrawer();

  return (
    <AppContainer>
      <AppDrawerHeader authorized={!!user} onToggleMobileDrawer={handleMobileToggle} username={user.name} />
      <AppDrawer
        header={DrawerHeader && <DrawerHeader projectId={projectId} user={user} />}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
        onMobileTransitionEnd={handleMobileTransitionEnd}
      >
        {DrawerContent && <DrawerContent projectId={projectId} user={user} />}
      </AppDrawer>
      <AppDrawerMain>{children}</AppDrawerMain>
    </AppContainer>
  );
};

export default ProjectLayoutComponent;
