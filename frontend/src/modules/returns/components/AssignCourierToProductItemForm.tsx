import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  AssignCourierToProductItemDTO,
  ProductItemDTO,
  UpdateOrderDTO,
  UserDTO,
} from 'generated-api';
import { useAssignCourierToProductItem } from '../hooks/useAssignCourierToProductItem';
import * as Yup from 'yup';
import { Select } from '../../../shared/components/form/Select/Select';

export const assignCourierToProductItemFormValidationSchema = Yup.object({
  courierId: Yup.string().min(1),
});

interface ProductItemFormProps {
  onClose?: () => void;
  productItem: ProductItemDTO;
  couriers: UserDTO[];
}

export const AssignCourierToProductItemForm: React.FC<ProductItemFormProps> = ({
  onClose,
  productItem,
  couriers,
}) => {
  const assignCourierToProductItem = useAssignCourierToProductItem(
    productItem.id
  );

  const onSubmit = (dto: AssignCourierToProductItemDTO) => {
    assignCourierToProductItem.mutate(dto, {
      onSettled: () => {
        if (onClose) {
          onClose();
        }
      },
    });
  };

  return (
    <Formik
      initialValues={{
        courierId: productItem.courier?.id ?? '',
      }}
      validationSchema={assignCourierToProductItemFormValidationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            <Field name='courierId' type='text'>
              {(fieldProps: FieldProps<string, UpdateOrderDTO>) => (
                <Select
                  fieldProps={fieldProps}
                  name='courierId'
                  label='Courier'
                  id='courierId'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                >
                  <option selected hidden disabled value=''>
                    Choose a courier
                  </option>
                  {couriers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.username}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </Box>

          <Box mb='4'>
            <Button
              formNoValidate
              type='submit'
              isLoading={assignCourierToProductItem.isLoading}
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
