import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  CreateProductItemDTO,
  CreateProductItemDTOStatusEnum,
  ProductItemDTO,
} from 'generated-api';
import { Input } from '../../../shared/components/form/Input/Input';
import { Select } from '../../../shared/components/form/Select/Select';
import { useEditProductItem } from '../hooks/useEditProductItem';
import { productItemFormValidationSchema } from './ProductItemForm';

interface ProductItemFormProps {
  onClose?: () => void;
  productId: string;
  productItem: ProductItemDTO;
}

export const generateMockRfId = () => Math.random().toString(36).slice(-8);

export const EditProductItemForm: React.FC<ProductItemFormProps> = ({
  onClose,
  productId,
  productItem,
}) => {
  const ediProductItem = useEditProductItem(productItem.id, productId);

  const onSubmit = (dto: CreateProductItemDTO) => {
    ediProductItem.mutate(dto, {
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
        ...productItem,
        status: productItem.status as unknown as CreateProductItemDTOStatusEnum,
      }}
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
                    Choose a company type
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
              isLoading={ediProductItem.isLoading}
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
