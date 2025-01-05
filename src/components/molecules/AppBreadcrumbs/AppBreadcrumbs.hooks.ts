import React from 'react';

export type SaveResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error: string;
    };

export type AppBreadcrumbsSavingProps = {
  readonly dirty: boolean;
  readonly message?: string;
  readonly onSave: () => Promise<SaveResult>;
};

export type AppBreadcrumbsSavingReturn = {
  readonly savingError: string;
  readonly onSaveClick: () => void;
  readonly onClearSavingError: () => void;
};

export function useAppBreadcrumbsSaving({
  dirty,
  message = 'You have unsaved changes, are you sure?',
  onSave,
}: AppBreadcrumbsSavingProps): AppBreadcrumbsSavingReturn {
  const [savingError, setSavingError] = React.useState<string>('');

  const onSaveClick = React.useCallback(() => {
    void onSave().then((result) => {
      if (result.success) return;
      setSavingError(result.error);
    });
  }, [onSave]);

  const onClearSavingError = () => {
    setSavingError('');
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (saveShortcutCommandFired(event)) {
        event.preventDefault();
        onSaveClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSaveClick]);

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dirty, message]);

  return { savingError, onSaveClick, onClearSavingError };
}

function saveShortcutCommandFired(event: KeyboardEvent): boolean {
  const isMacOS = navigator.userAgent.includes('Mac OS X');
  return isMacOS
    ? event.metaKey && event.key === 's' && !event.altKey && !event.ctrlKey
    : event.ctrlKey && event.key === 's' && !event.altKey && !event.metaKey;
}
