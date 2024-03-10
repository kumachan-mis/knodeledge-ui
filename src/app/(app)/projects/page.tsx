import ProjectCardList from '@/components/organisms/list/ProjectCardList';
import ProjectTitle from '@/components/organisms/list/ProjectTitle';
import ProjectToolbar from '@/components/organisms/list/ProjectToolbar';
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
