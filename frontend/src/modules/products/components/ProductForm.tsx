import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { CreateProductDTO } from 'generated-api';
import * as Yup from 'yup';
import { Input } from '../../../shared/components/form/Input/Input';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { CompanyDTOTypeEnum } from 'generated-api';
import { useGlobalStore } from '../../../shared/stores';

interface ProductFormProps {
  companyId: string;
  defaultValues?: CreateProductDTO;
  onClose?: () => void;
}

export const productFormValidationSchema = Yup.object({
  name: Yup.string().required('Required'),
  price: Yup.number().required('Required'),
  bulk: Yup.boolean().required('Required'),
  bulkQuantity: Yup.number().min(1, 'Must be greater than 0').optional(),
});

export const generateMockRfId = () => Math.random().toString(36).slice(-8);

export const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  companyId,
  onClose,
}) => {
  const createProduct = useCreateProduct(companyId);

  const initialValues: CreateProductDTO = {
    name: '',
    price: 0,
    bulk: true,
    bulkQuantity: undefined,
  };
  const getUser = useGlobalStore((state) => state.getUser);
  const companyType = getUser()?.company?.type;

  const isSuppManu = () => {
    if (
      companyType === CompanyDTOTypeEnum.Supplier ||
      CompanyDTOTypeEnum.Manufacturer
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = (dto: CreateProductDTO) => {
    createProduct.mutate(dto, {
      onSettled: () => {
        if (onClose) {
          onClose();
        }
      },
    });
  };

  return (
    <Formik
      initialValues={defaultValues ?? initialValues}
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
            {isSuppManu() && (
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
              isLoading={createProduct.isLoading}
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
