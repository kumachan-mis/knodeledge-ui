'use client';
import { ChapterActionError } from '@/contexts/openapi/chapters';
import { LoadableAction } from '@/contexts/openapi/types';
import { Chapter } from '@/openapi';

import Button, { ButtonProps } from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';

export type ChapterPreviewDialogFormComponentProps = {
  readonly submitText: string;
  readonly submitColor?: ButtonProps['color'];
  readonly chapter: Chapter;
  readonly onSubmit: () => Promise<LoadableAction<ChapterActionError>>;
  readonly onClose: () => void;
};

const ChapterPreviewDialogFormComponent: React.FC<ChapterPreviewDialogFormComponentProps> = ({
  submitText,
  submitColor,
  chapter,
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
          <Grid size={3}>Chapter Name</Grid>
          <Grid size={9}>{chapter.name}</Grid>
          <Grid size={3}>Chapter Number</Grid>
          <Grid size={9}>{chapter.number}</Grid>
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

export default ChapterPreviewDialogFormComponent;
