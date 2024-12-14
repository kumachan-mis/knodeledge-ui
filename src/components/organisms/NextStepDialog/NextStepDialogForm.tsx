'use client';
import { SectionsActionError } from '@/contexts/chapters';
import { LoadableAction } from '@/contexts/openapi';
import { usePaperContent } from '@/contexts/views';
import { SectionWithoutAutofield } from '@/openapi';

import { usePaperSections } from './NextStepDialog.hooks';
import NextStepDialogViewerComponent from './NextStepDialogViewer';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import Pagination from '@mui/material/Pagination';
import { useForm } from 'react-hook-form';

export type NextStepDialogFormComponentProps = {
  readonly onSubmit: (sections: SectionWithoutAutofield[]) => Promise<LoadableAction<SectionsActionError>>;
  readonly onClose: () => void;
};

const NextStepDialogFormComponent: React.FC<NextStepDialogFormComponentProps> = ({ onSubmit, onClose }) => {
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm();

  const paper = usePaperContent();
  const { sections, page, setPage, errorMessage } = usePaperSections({ paper });
  const section = sections[page - 1] as SectionWithoutAutofield | undefined;

  const handleSubmitForm = handleSubmit(async () => {
    const result = await onSubmit(sections);
    if (result.state === 'success') {
      onClose();
      return;
    }
    setError('root', { type: 'server', message: result.error.message });
    setError('root.sections', { type: 'server', message: result.error.sections.message });
  });

  const serverErrorMessage = [errors.root?.message, errors.root?.sections?.message]
    .filter((message) => !!message)
    .join(': ');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmitForm(event);
      }}
    >
      <DialogContent>
        <FormHelperText error>{errorMessage ? errorMessage : serverErrorMessage}</FormHelperText>
        {!section ? (
          <NextStepDialogViewerComponent content={paper.content} />
        ) : (
          <NextStepDialogViewerComponent content={section.content} header={section.name} headerSize="larger" />
        )}
      </DialogContent>
      <DialogActions>
        <Pagination
          count={sections.length}
          onChange={(_, page) => {
            setPage(page);
          }}
          page={page}
          sx={{ flexGrow: 1 }}
        />
        <Button disabled={isSubmitting} onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button disabled={!!errorMessage || isSubmitting} type="submit" variant="contained">
          Go to Next Step
        </Button>
      </DialogActions>
    </form>
  );
};

export default NextStepDialogFormComponent;
