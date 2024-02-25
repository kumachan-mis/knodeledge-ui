'use client';
import { LoadableAction } from '@/contexts/openapi';
import { ProjectWithoutAutofield, ProjectWithoutAutofieldError } from '@/openapi';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export type ProjectDialogComponentProps = {
  readonly open: boolean;
  readonly title: string;
  readonly submitText: string;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;
  readonly onClose: () => void;
};

type ProjectDialogFormComponentProps = {
  readonly submitText: string;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectWithoutAutofieldError>>;
  readonly onClose: () => void;
};

const ProjectDialogComponent: React.FC<ProjectDialogComponentProps> = ({
  open,
  title,
  submitText,
  onSubmit,
  onClose,
}) => (
  <Dialog fullWidth maxWidth="md" open={open}>
    <DialogTitle>{title}</DialogTitle>
    <ProjectDialogFormComponent onClose={onClose} onSubmit={onSubmit} submitText={submitText} />
  </Dialog>
);

const ProjectDialogFormComponent: React.FC<ProjectDialogFormComponentProps> = ({ submitText, onSubmit, onClose }) => {
  const {
    handleSubmit,
    control,
    setError,
    formState: { isValidating, isValid, isSubmitting, errors },
  } = useForm<{ name: string; description: string }>({
    defaultValues: { name: '', description: '' },
  });

  const onSubmitForm = handleSubmit(async (data) => {
    const result = await onSubmit(data);
    if (result.state === 'success') {
      onClose();
      return;
    }
    setError('name', { type: 'server', message: result.error.name });
    setError('description', { type: 'server', message: result.error.description });
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmitForm(event);
      }}
    >
      <DialogContent sx={{ '& > *': { my: 2 } }}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isSubmitting}
              error={!!errors.name}
              fullWidth
              helperText={errors.name?.message}
              label="Project Name"
              required
              variant="standard"
            />
          )}
          rules={{
            required: 'name is required',
            maxLength: { value: 100, message: 'name cannot be longer than 100 characters' },
          }}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isSubmitting}
              error={!!errors.description}
              fullWidth
              helperText={errors.description?.message}
              label="Project Description"
              multiline
              variant="standard"
            />
          )}
          rules={{
            maxLength: { value: 400, message: 'description cannot be longer than 400 characters' },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isValidating || isSubmitting} onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button disabled={isValidating || !isValid || isSubmitting} type="submit" variant="contained">
          {submitText}
        </Button>
      </DialogActions>
    </form>
  );
};

export default ProjectDialogComponent;
