'use client';
import AppError from '@/components/molecules/AppError';
import ProjectTopView from '@/components/organisms/top/ProjectTopView';
import { useInitProject, useLoadableProject } from '@/contexts/projects';
import { AuthorizedPageProps } from '@/utils/page';

import Button from '@mui/material/Button';
import { NextPage } from 'next';
import Link from 'next/link';

export type ProjectDetailPageClientProps = {
  readonly params: {
    readonly projectId: string;
  };
};

const ProjectDetailPageClient: NextPage<AuthorizedPageProps<ProjectDetailPageClientProps>> = ({ user, params }) => {
  useInitProject({ id: user.sub }, params.projectId);
  const loadableProject = useLoadableProject();

  if (loadableProject.state === 'notfound') {
    return (
      <AppError
        action={
          <Button LinkComponent={Link} href="/projects" variant="contained">
            Go to projects
          </Button>
        }
        message="Page not found"
        statusCode={404}
      />
    );
  }

  return <ProjectTopView />;
};

export default ProjectDetailPageClient;
