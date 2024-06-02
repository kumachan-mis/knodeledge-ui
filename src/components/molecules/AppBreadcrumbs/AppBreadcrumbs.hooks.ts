import React from 'react';

export type AppBreadcrumbsSavingProps = {
  readonly isDirty?: boolean;
  readonly message?: string;
  readonly onSave?: () => void;
};

export function useAppBreadcrumbsSaving({
  isDirty,
  message = 'You have unsaved changes, are you sure?',
  onSave,
}: AppBreadcrumbsSavingProps): void {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (saveShortcutCommandFired(event)) {
        event.preventDefault();
        onSave?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave]);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        isDirty &&
        event.target instanceof Element &&
        event.target.closest('a:not([target="_blank"]') &&
        !window.confirm(message)
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('click', handleClick, true);
    };
  }, [isDirty, message]);

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);
}

function saveShortcutCommandFired(event: KeyboardEvent): boolean {
  const isMacOS = navigator.userAgent.includes('Mac OS X');
  return isMacOS
    ? event.metaKey && event.key === 's' && !event.altKey && !event.ctrlKey
    : event.ctrlKey && event.key === 's' && !event.altKey && !event.metaKey;
}
