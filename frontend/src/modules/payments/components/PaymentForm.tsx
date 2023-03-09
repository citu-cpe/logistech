import { Box, Button, Checkbox } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { CreatePaymentDTO, OrderDTO } from 'generated-api';
import { Input } from '../../../shared/components/form/Input/Input';
import { useCreatePayment } from '../hooks/useCreatePayment';
import * as Yup from 'yup';
import { useState } from 'react';

interface PaymentFormProps {
  order: OrderDTO;
}

export const paymentFormValidationSchema = Yup.object({
  amount: Yup.number().required(),
  orderId: Yup.string().required(),
});

export const PaymentForm: React.FC<PaymentFormProps> = ({ order }) => {
  const createPayment = useCreatePayment();
  const [disabled, setDisabled] = useState(true);

  const initialValues: CreatePaymentDTO = {
    amount: order.total,
    orderId: order.id,
  };

  const onSubmit = (dto: CreatePaymentDTO) => {
    createPayment.mutate(dto);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={paymentFormValidationSchema}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form noValidate>
          <Box mb='4'>
            <Field name='amount' type='number'>
              {(fieldProps: FieldProps<number, CreatePaymentDTO>) => (
                <Input
                  disabled={disabled}
                  fieldProps={fieldProps}
                  name='amount'
                  label='Amount'
                  type='number'
                  id='Amount'
                  borderColor='gray.300'
                  bgColor='gray.50'
                  color='gray.800'
                />
              )}
            </Field>
          </Box>

          <Checkbox
            defaultChecked={true}
            mb='4'
            onChange={(e) => {
              if (e.target.checked) {
                setDisabled(true);
                props.setFieldValue('amount', order.total);
              } else {
                setDisabled(false);
              }
            }}
          >
            Full payment
          </Checkbox>

          <Box mb='4'>
            <Button
              formNoValidate
              type='submit'
              isLoading={createPayment.isLoading}
              width='full'
              bgColor='gray.800'
              color='gray.50'
              _hover={{ bgColor: 'gray.800', color: 'gray.50' }}
            >
              Pay
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
