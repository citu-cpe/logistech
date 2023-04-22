import { Box, Button } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { UpdateUserDTO } from 'generated-api';
import { useGetUser } from '../hooks/useGetUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import * as Yup from 'yup';
import { Input } from '../../../shared/components/form/Input/Input';

interface SettingsFormProps {
  onClose?: () => void;
}

export const settingsFormValidationSchema = Yup.object({
  username: Yup.string().required('Required'),
});

export const SettingsForm: React.FC<SettingsFormProps> = ({ onClose }) => {
  const { data } = useGetUser();
  const updateUser = useUpdateUser();

  const onSubmit = (dto: UpdateUserDTO) => {
    updateUser.mutate(dto, {
      onSettled: () => {
        if (onClose) {
          onClose();
        }
      },
    });
  };

  return data?.data ? (
    <Formik
      initialValues={{
        username: data?.data.username,
        address: data?.data.address,
      }}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            <Field name='username' type='text'>
              {(fieldProps: FieldProps<string, UpdateUserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='username'
                  label='Username'
                  type='text'
                  id='username'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                />
              )}
            </Field>
            <Field name='address' type='text'>
              {(fieldProps: FieldProps<string, UpdateUserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='address'
                  label='Address'
                  type='text'
                  id='address'
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
              isLoading={updateUser.isLoading}
              bgColor='gray.800'
              color='gray.50'
              width='full'
              _hover={{ bgColor: 'gray.800', color: 'gray.50' }}
            >
              Save
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  ) : (
    <></>
  );
};
