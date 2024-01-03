'use client';
import React from 'react';

import { fetchHelloWorld } from '@/actions/fetchHelloWorld';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type LoadableMessage = {
  message: string;
  loading: boolean;
};

const HelloWorldClientView: React.FC = () => {
  const [loadableMessage, setLoadableMessage] = React.useState<LoadableMessage>({
    message: 'loading...',
    loading: true,
  });
  const [count, setCount] = React.useState<number>(0);

  const helloWorld = React.useCallback(() => {
    setLoadableMessage((prev) => ({ ...prev, loading: true }));

    void (async () => {
      const fetchedMessage = await fetchHelloWorld({ name: `client${count}` });
      setLoadableMessage({ message: fetchedMessage, loading: false });
      setCount(count + 1);
    })();
  }, [count]);

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
