import HelloWorldClientView from '@/components/organisms/HelloWorldClientView';

import Container from '@mui/material/Container';

const Home: React.FC = () => (
  <Container component="main" maxWidth="xl">
    <div>
      <HelloWorldClientView />
    </div>
  </Container>
);

export default Home;
