import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { CreateReportDTO } from 'generated-api';
import * as Yup from 'yup';
import { Textarea } from '../../../shared/components/form/Textarea/Textarea';
import { useCreateReport } from '../../red-flags/hooks/useCreateReport';

interface CreateReportFormProps {
  onClose?: () => void;
  productItemId: string;
}

export const reportFormValidationSchema = Yup.object({
  description: Yup.string().required('Required'),
});

export const ReportForm: React.FC<CreateReportFormProps> = ({
  onClose,
  productItemId,
}) => {
  const createReport = useCreateReport();

  const initialValues: CreateReportDTO = {
    description: '',
    productItemId,
  };

  const onSubmit = (dto: CreateReportDTO) => {
    createReport.mutate(dto, {
      onSettled: () => {
        if (onClose) {
          onClose();
        }
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={reportFormValidationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            <Field name='description' type='text'>
              {(fieldProps: FieldProps<string, CreateReportDTO>) => (
                <Textarea
                  fieldProps={fieldProps}
                  name='description'
                  label='Description'
                  id='description'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                />
              )}
            </Field>
          </Box>
          <Box mb='4'>
            <Button
              formNoValidate
              type='submit'
              isLoading={createReport.isLoading}
              width='full'
              bgColor='gray.800'
              color='gray.50'
              _hover={{ bgColor: 'gray.800', color: 'gray.50' }}
            >
              Save
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
