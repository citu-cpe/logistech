import { Button, Box, Flex } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  CompanyDTO,
  OrderDTO,
  UpdateOrderDTO,
  UpdateOrderDTOStatusEnum,
  UpdateOrderStatusDTOStatusEnum,
  UserDTO,
} from 'generated-api';
import * as Yup from 'yup';
import { Input } from '../../../shared/components/form/Input/Input';
import { Select } from '../../../shared/components/form/Select/Select';
import { useUpdateOrder } from '../hooks/useUpdateOrder';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';

interface OrderFormProps {
  order: OrderDTO;
  onClose?: () => void;
  partnerStorageFacilities?: CompanyDTO[];
  couriers?: UserDTO[];
  incoming: boolean;
  billed?: boolean;
}

const orderFormValidationSchema = Yup.object({
  status: Yup.mixed<UpdateOrderDTOStatusEnum>()
    .oneOf(Object.values(UpdateOrderDTOStatusEnum))
    .required(),
  storageFacilityId: Yup.string().optional(),
  courierId: Yup.string().optional(),
  shippingFee: Yup.string().optional(),
});

export const OrderForm: React.FC<OrderFormProps> = ({
  order,
  onClose,
  partnerStorageFacilities,
  couriers,
  incoming,
  billed,
}) => {
  const updateOrder = useUpdateOrder(order.id);
  const updateOrderStatus = useUpdateOrderStatus(order.id);
  const initialValues: UpdateOrderDTO = {
    status: order.status as unknown as UpdateOrderDTOStatusEnum,
    storageFacilityId: order.storageFacility?.id,
    courierId: order.courier?.id,
    dueDate:
      order.dueDate && new Date(order.dueDate).toISOString().split('T')[0],
    shippingFee: order.shippingFee ?? undefined,
  };

  const onSubmit = (dto: UpdateOrderDTO) => {
    updateOrder.mutate(dto, {
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
            {billed === undefined && (
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
                    <option value={UpdateOrderDTOStatusEnum.Overdue}>
                      OVERDUE
                    </option>
                    <option value={UpdateOrderDTOStatusEnum.Billed}>
                      BILLED
                    </option>
                    <option value={UpdateOrderDTOStatusEnum.Rejected}>
                      REJECTED
                    </option>
                  </Select>
                )}
              </Field>
            )}

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

            {!!couriers && billed !== undefined && !!billed && (
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
              <Field name='dueDate' type='date'>
                {(fieldProps: FieldProps<Date, UpdateOrderDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='dueDate'
                    label='Due Date'
                    type='datetime-local'
                    id='date'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  />
                )}
              </Field>
            )}
            {billed !== undefined && !billed && (
              <Field name='shippingFee' type='number'>
                {(fieldProps: FieldProps<number, UpdateOrderDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='shippingFee'
                    label='Shipping Fee'
                    type='number'
                    id='shippingFee'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                  />
                )}
              </Field>
            )}
          </Box>

          <Flex mb='4' gap='4'>
            {billed !== undefined && !billed && (
              <Button
                onClick={() =>
                  updateOrderStatus.mutate(
                    {
                      status: UpdateOrderStatusDTOStatusEnum.Rejected,
                    },
                    {
                      onSettled: () => {
                        if (onClose) {
                          onClose();
                        }
                      },
                    }
                  )
                }
                formNoValidate
                isLoading={updateOrder.isLoading || updateOrderStatus.isLoading}
                width='full'
                bgColor='red.800'
                color='gray.50'
                _hover={{ bgColor: 'red.800', color: 'gray.50' }}
              >
                Reject
              </Button>
            )}

            <Button
              formNoValidate
              type='submit'
              isLoading={updateOrder.isLoading || updateOrderStatus.isLoading}
              width='full'
              bgColor='gray.800'
              color='gray.50'
              _hover={{ bgColor: 'gray.800', color: 'gray.50' }}
            >
              Save
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
