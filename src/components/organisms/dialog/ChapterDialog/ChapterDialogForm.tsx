'use client';
import { ChapterActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { ChapterWithoutAutofield } from '@/openapi';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import React from 'react';
import { Controller, useForm, Validate } from 'react-hook-form';

export type ChapterDialogFormComponentProps = {
  readonly submitText: string;
  readonly defaultValues: ChapterFieldValues;
  readonly validates?: ChapterFieldValidates;
  readonly onSubmit: (project: ChapterWithoutAutofield) => Promise<LoadableAction<ChapterActionError>>;
  readonly onClose: () => void;
};

export type ChapterFieldValues = {
  name: string;
  number: string;
};

export type ChapterFieldValidates = {
  name?: Validate<string, ChapterFieldValues>;
  number?: Validate<string, ChapterFieldValues>;
};

const ChapterDialogFormComponent: React.FC<ChapterDialogFormComponentProps> = ({
  submitText,
  defaultValues,
  validates,
  onSubmit,
  onClose,
}) => {
  const {
    handleSubmit,
    control,
    setError,
    formState: { isValidating, isValid, isDirty, isSubmitting, errors },
  } = useForm<ChapterFieldValues>({ defaultValues, mode: 'onChange' });

  const handleSubmitForm = handleSubmit(async (data) => {
    const result = await onSubmit({ name: data.name, number: parseInt(data.number, 10) });
    if (result.state === 'success') {
      onClose();
      return;
    }
    setError('root', { type: 'server', message: result.error.message });
    setError('name', { type: 'server', message: result.error.chapter.name });
    setError('number', { type: 'server', message: result.error.chapter.number });
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
              label="Chapter Name"
              variant="standard"
            />
          )}
          rules={{
            required: 'chapter name is required',
            maxLength: { value: 100, message: 'chapter name cannot be longer than 100 characters' },
            validate: validates?.name,
          }}
        />
        <Controller
          control={control}
          name="number"
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isSubmitting}
              error={!!errors.number}
              fullWidth
              helperText={errors.number?.message}
              label="Chapter Number"
              variant="standard"
            />
          )}
          rules={{
            required: 'chapter number is required',
            pattern: { value: /^[1-9][0-9]*$/, message: 'chapter number must be a positive integer' },
            validate: validates?.number,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isValidating || isSubmitting} onClick={onClose} variant="outlined">
          Close
        </Button>
        {/**
         * Button can be disabled if isDitry because:
         * - if new chapter is being created, chapter name is required
         * - if chapter is being update, one or more of chapter properties must be different from the original
         */}
        <Button disabled={isValidating || !isValid || !isDirty || isSubmitting} type="submit" variant="contained">
          {submitText}
        </Button>
      </DialogActions>
    </form>
  );
};

export default ChapterDialogFormComponent;
