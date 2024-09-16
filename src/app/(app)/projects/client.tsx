'use client';
import ProjectCardList from '@/components/organisms/ProjectCardList';
import ProjectTitle from '@/components/organisms/ProjectTitle';
import ProjectToolbar from '@/components/organisms/ProjectToolbar';
import { useInitProjectList } from '@/contexts/projects';
import { AuthorizedPageProps } from '@/utils/page';

import Container from '@mui/material/Container';
import { NextPage } from 'next';

const ProjectListPageClient: NextPage<AuthorizedPageProps> = ({ user }) => {
  useInitProjectList(user.sub);

  return (
    <Container maxWidth="lg" sx={{ my: 6 }}>
      <ProjectTitle>PROJECTS</ProjectTitle>
      <ProjectToolbar user={user} />
      <ProjectCardList user={user} />
    </Container>
  );
};

export default ProjectListPageClient;
