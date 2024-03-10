import ProjectCardList from '@/components/organisms/projects/ProjectCardList';
import ProjectTitle from '@/components/organisms/projects/ProjectTitle';
import ProjectToolbar from '@/components/organisms/projects/ProjectToolbar';
import { ProjectListContextProvider } from '@/contexts/projects';

import { getSession } from '@auth0/nextjs-auth0';
import Box from '@mui/material/Box';
import { NextPage } from 'next';

const ProjectListPage: NextPage = async () => {
  const session = await getSession();

  return (
    session?.user && (
      <Box>
        <ProjectTitle>PROJECTS</ProjectTitle>
        <ProjectListContextProvider>
          <ProjectToolbar user={session.user} />
          <ProjectCardList user={session.user} />
        </ProjectListContextProvider>
      </Box>
    )
  );
};

export default ProjectListPage;
