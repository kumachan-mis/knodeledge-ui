import HelloWorldClientView from '@/components/organisms/HelloWorldClientView';

import { getSession } from '@auth0/nextjs-auth0';
import Container from '@mui/material/Container';

const Home: React.FC = async () => {
  const session = await getSession();
  return (
    <Container component="main" maxWidth="xl">
      <div>{session?.user && <HelloWorldClientView user={session.user} />}</div>
    </Container>
  );
};

export default Home;
