import HelloWorldClientView from '@/components/organisms/HelloWorldClientView';
import HelloWorldServerView from '@/components/organisms/HelloWorldServerView';

import Container from '@mui/material/Container';

const Home: React.FC = () => (
  <Container component="main" maxWidth="xl">
    <div>
      <HelloWorldServerView />
      <HelloWorldClientView />
    </div>
  </Container>
);

export default Home;
