import React from 'react';

type UseDialogReturn = {
  readonly open: boolean;
  readonly onOpen: () => void;
  readonly onClose: () => void;
};

export function useDialog(): UseDialogReturn {
  const [open, setOpen] = React.useState(false);
  const onOpen = React.useCallback(() => {
    setOpen(true);
  }, []);
  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);
  return { open, onOpen, onClose };
}
