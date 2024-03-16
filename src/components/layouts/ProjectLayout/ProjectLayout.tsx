'use client';
import AppContainer from '@/components/molecules/AppContainer';
import AppDrawer, { useAppDrawer } from '@/components/molecules/AppDrawer';
import AppDrawerHeader from '@/components/molecules/AppDrawerHeader';
import AppDrawerMain from '@/components/molecules/AppDrawerMain';

import { Claims } from '@auth0/nextjs-auth0';
import React from 'react';

export type ProjectLayoutComponentProps = {
  readonly user: Claims;
  readonly children?: React.ReactNode;
};

const ProjectLayoutComponent: React.FC<ProjectLayoutComponentProps> = ({ user, children }) => {
  const { mobileOpen, handleMobileClose, handleMobileToggle, handleMobileTransitionEnd } = useAppDrawer();

  return (
    <AppContainer>
      <AppDrawerHeader authorized={!!user} onToggleMobileDrawer={handleMobileToggle} username={user.name} />
      <AppDrawer
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
        onMobileTransitionEnd={handleMobileTransitionEnd}
      />
      <AppDrawerMain>{children}</AppDrawerMain>
    </AppContainer>
  );
};

export default ProjectLayoutComponent;
