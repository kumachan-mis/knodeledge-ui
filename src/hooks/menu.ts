import React from 'react';

type UseMenuReturn = {
  readonly open: boolean;
  readonly anchorEl: HTMLElement | null;
  readonly onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  readonly onClose: () => void;
};

export function useMenu(): UseMenuReturn {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const onOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  React.useEffect(() => {
    window.addEventListener('resize', onClose);
    return () => {
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  return { open: !!anchorEl, anchorEl, onOpen, onClose };
}
