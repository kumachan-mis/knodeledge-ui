'use client';
import { fetchHelloWorld } from '@/actions/fetchHelloWorld';

import { Claims } from '@auth0/nextjs-auth0';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';

type HelloWorldClientViewProps = {
  readonly user: Claims;
};

type LoadableMessage = {
  message: string;
  loading: boolean;
};

const HelloWorldClientView: React.FC<HelloWorldClientViewProps> = ({ user }) => {
  const [loadableMessage, setLoadableMessage] = React.useState<LoadableMessage>({
    message: 'loading...',
    loading: true,
  });
  const [count, setCount] = React.useState<number>(0);

  const helloWorld = React.useCallback(() => {
    setLoadableMessage((prev) => ({ ...prev, loading: true }));

    void (async () => {
      const errorable = await fetchHelloWorld({ name: `${user.name}#${count}` });
      const message = errorable.response ? errorable.response.message : errorable.error.message;
      setLoadableMessage({ message, loading: false });
      setCount(count + 1);
    })();
  }, [count, user.name]);

  React.useEffect(() => {
    helloWorld();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box my={1}>
      <Typography variant="h6">Client Component</Typography>
      <Typography>{loadableMessage.message}</Typography>
      <Button disabled={loadableMessage.loading} onClick={helloWorld} variant="contained">
        count up
      </Button>
    </Box>
  );
};

export default HelloWorldClientView;
