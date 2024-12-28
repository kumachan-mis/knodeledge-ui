'use client';
import ProjectCardList from '@/components/organisms/ProjectCardList';
import ProjectTitle from '@/components/organisms/ProjectTitle';
import ProjectToolbar from '@/components/organisms/ProjectToolbar';
import { AuthorizedPageProps } from '@/utils/page';

import Container from '@mui/material/Container';
import React from 'react';

const ProjectListPageClient: React.FC<AuthorizedPageProps> = ({ user }) => (
  <Container maxWidth="lg" sx={{ my: 6 }}>
    <ProjectTitle>PROJECTS</ProjectTitle>
    <ProjectToolbar user={user} />
    <ProjectCardList user={user} />
  </Container>
);

export default ProjectListPageClient;
