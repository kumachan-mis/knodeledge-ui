import ProjectCardList from '@/components/organisms/projects/ProjectCardList';
import ProjectTitle from '@/components/organisms/projects/ProjectTitle';
import { ProjectListContextProvider } from '@/contexts/projects';

import { getSession } from '@auth0/nextjs-auth0';
import Container from '@mui/material/Container';

const ProjectList: React.FC = async () => {
  const session = await getSession();

  return (
    <Container component="main" maxWidth="lg">
      <ProjectTitle />
      <ProjectListContextProvider>
        {session?.user && <ProjectCardList user={session.user} />}
      </ProjectListContextProvider>
    </Container>
  );
};

export default ProjectList;
