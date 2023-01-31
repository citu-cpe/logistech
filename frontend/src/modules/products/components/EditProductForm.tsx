import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { CreateProductDTO, ProductDTO } from 'generated-api';
import { Input } from '../../../shared/components/form/Input/Input';
import { useEditProduct } from '../hooks/useEditProduct';
import { productFormValidationSchema } from './ProductForm';

interface EditProductFormProps {
  product: ProductDTO;
  onClose?: () => void;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onClose,
}) => {
  const editProduct = useEditProduct(product.id!);

  const onSubmit = (dto: CreateProductDTO) => {
    editProduct.mutate(dto, {
      onSettled: () => {
        if (onClose) {
          onClose();
        }
      },
    });
  };

  return (
    <Formik
      initialValues={product}
      validationSchema={productFormValidationSchema}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form noValidate>
          <Box mb='4'>
            <Field name='name' type='text'>
              {(fieldProps: FieldProps<string, CreateProductDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='name'
                  label='Product Name'
                  type='text'
                  id='name'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                />
              )}
            </Field>
            <Field name='price' type='number'>
              {(fieldProps: FieldProps<number, CreateProductDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='price'
                  label='Price'
                  type='number'
                  id='price'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                />
              )}
            </Field>
            <Field name='bulk' type='boolean'>
              {(fieldProps: FieldProps<boolean, CreateProductDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='bulk'
                  label='Bulk'
                  type='checkbox'
                  id='bulk'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                />
              )}
            </Field>
            {props.values.bulk && (
              <Field name='bulkQuantity' type='number'>
                {(fieldProps: FieldProps<string, CreateProductDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='bulkQuantity'
                    label='Bulk Quantity'
                    type='number'
                    id='bulkQuantity'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  />
                )}
              </Field>
            )}
          </Box>
          <Box mb='4'>
            <Button
              formNoValidate
              type='submit'
              isLoading={editProduct.isLoading}
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
