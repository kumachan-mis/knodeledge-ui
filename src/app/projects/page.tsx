import ProjectCardList from '@/components/organisms/projects/ProjectCardList';
import ProjectTitle from '@/components/organisms/projects/ProjectTitle';
import ProjectToolbar from '@/components/organisms/projects/ProjectToolbar';
import { ProjectListContextProvider } from '@/contexts/projects';

import { getSession } from '@auth0/nextjs-auth0';
import Container from '@mui/material/Container';
import { NextPage } from 'next';

const ProjectListPage: NextPage = async () => {
  const session = await getSession();

  return (
    <Container component="main" maxWidth="lg" sx={{ my: 6 }}>
      <ProjectTitle>PROJECTS</ProjectTitle>
      {session?.user && (
        <ProjectListContextProvider>
          <ProjectToolbar user={session.user} />
          <ProjectCardList user={session.user} />
        </ProjectListContextProvider>
      )}
    </Container>
  );
};

export default ProjectListPage;
