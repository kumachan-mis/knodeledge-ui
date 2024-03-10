import React from 'react';

export type UseProjectDrawerReturn = {
  readonly mobileOpen: boolean;
  readonly handleMobileClose: () => void;
  readonly handleMobileToggle: () => void;
  readonly handleMobileTransitionEnd: () => void;
};

function useProjectDrawer(): UseProjectDrawerReturn {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileClosing, setMobileClosing] = React.useState(false);

  const handleMobileClose = () => {
    setMobileClosing(true);
    setMobileOpen(false);
  };

  const handleMobileTransitionEnd = () => {
    setMobileClosing(false);
  };

  const handleMobileToggle = () => {
    if (mobileClosing) return;
    setMobileOpen(!mobileOpen);
  };

  return { mobileOpen, handleMobileClose, handleMobileToggle, handleMobileTransitionEnd };
}

export default useProjectDrawer;
