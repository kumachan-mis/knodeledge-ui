'use client';
import ProjectCardList from '@/components/organisms/list/ProjectCardList';
import ProjectTitle from '@/components/organisms/list/ProjectTitle';
import ProjectToolbar from '@/components/organisms/list/ProjectToolbar';
import { useInitProjectList } from '@/contexts/projects';
import { AuthorizedPageProps } from '@/utils/page';

import Box from '@mui/material/Box';
import { NextPage } from 'next';

const ProjectListPageClient: NextPage<AuthorizedPageProps> = ({ user }) => {
  useInitProjectList({ id: user.sub });

  return (
    <Box>
      <ProjectTitle>PROJECTS</ProjectTitle>
      <ProjectToolbar user={user} />
      <ProjectCardList user={user} />
    </Box>
  );
};

export default ProjectListPageClient;
