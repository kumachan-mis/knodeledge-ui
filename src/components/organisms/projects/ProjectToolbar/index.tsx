'use client';
import ProjectToolbarComponent from './ProjectToolbar';

import { Claims } from '@auth0/nextjs-auth0';

export type ProjectToolbarProps = {
  readonly user: Claims;
};

const ProjectToolbar: React.FC<ProjectToolbarProps> = () => {
  return (
    <ProjectToolbarComponent
      // eslint-disable-next-line @typescript-eslint/require-await
      onCreateProject={async () => {
        // TODO: Implement onCreateProject
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return { state: 'success', error: null };
      }}
    />
  );
};

export default ProjectToolbar;
