'use client';
import { ProjectActionError } from '@/contexts/openapi/projects';
import { LoadableAction } from '@/contexts/openapi/types';
import { Project } from '@/openapi';

import Button, { ButtonProps } from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';

export type ProjectPreviewDialogFormComponentProps = {
  readonly submitText: string;
  readonly submitColor?: ButtonProps['color'];
  readonly project: Project;
  readonly onSubmit: () => Promise<LoadableAction<ProjectActionError>>;
  readonly onClose: () => void;
};

const ProjectPreviewDialogFormComponent: React.FC<ProjectPreviewDialogFormComponentProps> = ({
  submitText,
  submitColor,
  project,
  onSubmit,
  onClose,
}) => {
  const {
    handleSubmit,
    setError,
    formState: { isValidating, isValid, isSubmitting, errors },
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  } = useForm<{}>({ mode: 'onChange' });

  const handleSubmitForm = handleSubmit(async () => {
    const result = await onSubmit();
    if (result.state === 'success') {
      onClose();
      return;
    }
    setError('root', { type: 'server', message: result.error.message });
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmitForm(event);
      }}
    >
      <DialogContent sx={{ '& > *': { my: 2 } }}>
        <FormHelperText error>{errors.root?.message}</FormHelperText>
        <Grid container spacing={2}>
          <Grid size={3}>Project Name</Grid>
          <Grid size={9}>{project.name}</Grid>
          <Grid size={3}>Project Description</Grid>
          <Grid size={9}>{project.description ?? ''}</Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" disabled={isValidating || isSubmitting} onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          color={submitColor}
          disabled={isValidating || !isValid || isSubmitting}
          type="submit"
          variant="contained"
        >
          {submitText}
        </Button>
      </DialogActions>
    </form>
  );
};

export default ProjectPreviewDialogFormComponent;
