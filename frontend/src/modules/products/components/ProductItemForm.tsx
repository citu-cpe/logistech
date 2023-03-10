import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  CreateProductItemDTO,
  CreateProductItemDTOStatusEnum,
} from 'generated-api';
import * as Yup from 'yup';
import { Input } from '../../../shared/components/form/Input/Input';
import { Select } from '../../../shared/components/form/Select/Select';
import { useCreateProductItem } from '../hooks/useCreateProductItem';

interface ProductItemFormProps {
  onClose?: () => void;
  productId: string;
}

export const productItemFormValidationSchema = Yup.object({
  rfid: Yup.string().min(1).required('Required'),
  status: Yup.string().min(1).required('Required'),
});

export const generateMockRfId = () => Math.random().toString(36).slice(-8);

export const ProductItemForm: React.FC<ProductItemFormProps> = ({
  onClose,
  productId,
}) => {
  const createProductItem = useCreateProductItem(productId);

  const initialValues: CreateProductItemDTO = {
    rfid: '',
    status: CreateProductItemDTOStatusEnum.InStorage,
  };

  const onSubmit = (dto: CreateProductItemDTO) => {
    createProductItem.mutate(dto, {
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
      validationSchema={productItemFormValidationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            <Field name='rfid' type='text'>
              {(fieldProps: FieldProps<string, CreateProductItemDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='rfid'
                  label='RFID'
                  type='text'
                  id='rfid'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                />
              )}
            </Field>
            <Field name='status'>
              {(
                fieldProps: FieldProps<
                  CreateProductItemDTOStatusEnum,
                  CreateProductItemDTO
                >
              ) => (
                <Select
                  fieldProps={fieldProps}
                  name='status'
                  label='Status'
                  id='status'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                >
                  <option selected hidden disabled value=''>
                    Choose Status
                  </option>
                  <option value={CreateProductItemDTOStatusEnum.InStorage}>
                    IN STORAGE
                  </option>
                  <option value={CreateProductItemDTOStatusEnum.OnHold}>
                    ON HOLD
                  </option>
                  <option value={CreateProductItemDTOStatusEnum.ToBePickedUp}>
                    TO BE PICKED UP
                  </option>
                  <option value={CreateProductItemDTOStatusEnum.InTransit}>
                    IN TRANSIT
                  </option>
                  <option value={CreateProductItemDTOStatusEnum.RedFlag}>
                    RED FLAG
                  </option>
                  <option value={CreateProductItemDTOStatusEnum.Canceled}>
                    CANCELED
                  </option>
                  <option value={CreateProductItemDTOStatusEnum.Complete}>
                    COMPLETE
                  </option>
                </Select>
              )}
            </Field>
          </Box>
          <Box mb='4'>
            <Button
              formNoValidate
              type='submit'
              isLoading={createProductItem.isLoading}
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
