'use client';
import { SectionsActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { SectionWithoutAutofield } from '@/openapi';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import { useForm } from 'react-hook-form';

export type NextStepDialogFormComponentProps = {
  readonly sections: SectionWithoutAutofield[];
  readonly onSubmit: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
  readonly onClose: () => void;
};

const NextStepDialogFormComponent: React.FC<NextStepDialogFormComponentProps> = ({ sections, onSubmit, onClose }) => {
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm();

  const handleSubmitForm = handleSubmit(async () => {
    const result = await onSubmit(sections);
    if (result.state === 'success') {
      onClose();
      return;
    }
    setError('root', { type: 'server', message: result.error.message });
    setError('root.sections', { type: 'server', message: result.error.sections.message });
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmitForm(event);
      }}
    >
      <DialogContent sx={{ '& > *': { my: 2 } }}>
        <FormHelperText error>
          {`${errors.root?.message ?? ''}${errors.root?.sections?.message ? `: ${errors.root.sections.message}` : ''}`}
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button disabled={isSubmitting} type="submit" variant="contained">
          Go to Next Step
        </Button>
      </DialogActions>
    </form>
  );
};

export default NextStepDialogFormComponent;
