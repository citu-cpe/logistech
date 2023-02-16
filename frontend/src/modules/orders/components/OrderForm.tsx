import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  OrderDTO,
  UpdateOrderStatusDTO,
  UpdateOrderStatusDTOStatusEnum,
} from 'generated-api';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import * as Yup from 'yup';
import { Select } from '../../../shared/components/form/Select/Select';

interface OrderFormProps {
  order: OrderDTO;
  onClose?: () => void;
}

const orderFormValidationSchema = Yup.object({
  status: Yup.mixed<UpdateOrderStatusDTOStatusEnum>()
    .oneOf(Object.values(UpdateOrderStatusDTOStatusEnum))
    .required(),
});

export const OrderForm: React.FC<OrderFormProps> = ({ order, onClose }) => {
  const updateOrderStatus = useUpdateOrderStatus(order.id);
  const initialValues: UpdateOrderStatusDTO = {
    status: order.status as unknown as UpdateOrderStatusDTOStatusEnum,
  };

  const onSubmit = (dto: UpdateOrderStatusDTO) => {
    updateOrderStatus.mutate(dto, {
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
      validationSchema={orderFormValidationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            <Field name='status' type='text'>
              {(fieldProps: FieldProps<string, UpdateOrderStatusDTO>) => (
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
                    Choose a status
                  </option>
                  <option value={UpdateOrderStatusDTOStatusEnum.Pending}>
                    PENDING
                  </option>
                  <option value={UpdateOrderStatusDTOStatusEnum.Invoiced}>
                    INVOICED
                  </option>
                  <option value={UpdateOrderStatusDTOStatusEnum.Paid}>
                    PAID
                  </option>
                </Select>
              )}
            </Field>
          </Box>
          <Box mb='4'>
            <Button
              formNoValidate
              type='submit'
              isLoading={updateOrderStatus.isLoading}
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
