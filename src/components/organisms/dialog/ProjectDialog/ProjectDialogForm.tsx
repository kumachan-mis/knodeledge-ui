'use client';
import { LoadableAction } from '@/contexts/openapi';
import { ProjectActionError } from '@/contexts/projects';
import { ProjectWithoutAutofield } from '@/openapi';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export type ProjectDialogFormComponentProps = {
  readonly submitText: string;
  readonly defaultValues: ProjectFieldValues;
  readonly onSubmit: (project: ProjectWithoutAutofield) => Promise<LoadableAction<ProjectActionError>>;
  readonly onClose: () => void;
};

export type ProjectFieldValues = {
  name: string;
  description: string;
};

const ProjectDialogFormComponent: React.FC<ProjectDialogFormComponentProps> = ({
  submitText,
  defaultValues,
  onSubmit,
  onClose,
}) => {
  const {
    handleSubmit,
    control,
    setError,
    formState: { isValidating, isValid, isSubmitting, errors },
  } = useForm<ProjectFieldValues>({ defaultValues });

  const handleSubmitForm = handleSubmit(async (data) => {
    const result = await onSubmit(data);
    if (result.state === 'success') {
      onClose();
      return;
    }
    setError('root', { type: 'server', message: result.error.message });
    setError('name', { type: 'server', message: result.error.project.name });
    setError('description', { type: 'server', message: result.error.project.description });
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

export default ProjectDialogFormComponent;
