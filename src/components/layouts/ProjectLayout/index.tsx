import ProjectLayoutComponent from './ProjectLayout';

import { Claims, getSession } from '@auth0/nextjs-auth0';
import React from 'react';

export type ProjectLayoutProps = {
  readonly DrawerHeader?: React.FC<{ readonly user: Claims }>;
  readonly DrawerContent?: React.FC<{ readonly user: Claims }>;
  readonly children?: React.ReactNode;
};

const ProjectLayout: React.FC<ProjectLayoutProps> = async ({ DrawerHeader, DrawerContent, children }) => {
  const session = await getSession();

  return (
    session?.user && (
      <ProjectLayoutComponent DrawerContent={DrawerContent} DrawerHeader={DrawerHeader} user={session.user}>
        {children}
      </ProjectLayoutComponent>
    )
  );
};

export default ProjectLayout;
