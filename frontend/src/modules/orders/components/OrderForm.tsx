import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  CompanyDTO,
  OrderDTO,
  UpdateOrderDTO,
  UpdateOrderDTOStatusEnum,
  UserDTO,
} from 'generated-api';
import * as Yup from 'yup';
import { Input } from '../../../shared/components/form/Input/Input';
import { Select } from '../../../shared/components/form/Select/Select';
import { useUpdateOrder } from '../hooks/useUpdateOrder';

interface OrderFormProps {
  order: OrderDTO;
  onClose?: () => void;
  partnerStorageFacilities?: CompanyDTO[];
  couriers?: UserDTO[];
  incoming: boolean;
}

const orderFormValidationSchema = Yup.object({
  status: Yup.mixed<UpdateOrderDTOStatusEnum>()
    .oneOf(Object.values(UpdateOrderDTOStatusEnum))
    .required(),
  storageFacilityId: Yup.string().optional(),
  courierId: Yup.string().optional(),
});

export const OrderForm: React.FC<OrderFormProps> = ({
  order,
  onClose,
  partnerStorageFacilities,
  couriers,
  incoming,
}) => {
  const updateOrderStatus = useUpdateOrder(order.id);
  const initialValues: UpdateOrderDTO = {
    status: order.status as unknown as UpdateOrderDTOStatusEnum,
    storageFacilityId: order.storageFacility?.id,
    courierId: order.courier?.id,
    dueDate:
      order.dueDate && new Date(order.dueDate).toISOString().split('T')[0],
  };

  const onSubmit = (dto: UpdateOrderDTO) => {
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
              {(fieldProps: FieldProps<string, UpdateOrderDTO>) => (
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
                  <option value={UpdateOrderDTOStatusEnum.Pending}>
                    PENDING
                  </option>
                  <option value={UpdateOrderDTOStatusEnum.Invoiced}>
                    INVOICED
                  </option>
                  <option value={UpdateOrderDTOStatusEnum.Paid}>PAID</option>
                </Select>
              )}
            </Field>
            {!!partnerStorageFacilities && (
              <Field name='storageFacilityId' type='text'>
                {(fieldProps: FieldProps<string, UpdateOrderDTO>) => (
                  <Select
                    fieldProps={fieldProps}
                    name='storageFacilityId'
                    label='Storage Facility'
                    id='storageFacilityId'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  >
                    <option selected hidden disabled value=''>
                      Choose a storage facility
                    </option>
                    {partnerStorageFacilities.map((sf) => (
                      <option key={sf.id} value={sf.id}>
                        {sf.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            )}
            {!!couriers && (
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
            )}
            {incoming && (
              <Field name='dueDate' type='test'>
                {(fieldProps: FieldProps<Date, UpdateOrderDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='dueDate'
                    label='Due Date'
                    type='date'
                    id='date'
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
