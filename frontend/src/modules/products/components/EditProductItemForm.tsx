import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  CompanyDTOTypeEnum,
  CreateProductItemDTO,
  CreateProductItemDTOStatusEnum,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  ProductItemLocationDTO,
} from 'generated-api';
import { useContext, useRef, useEffect } from 'react';
import { Input } from '../../../shared/components/form/Input/Input';
import { Select } from '../../../shared/components/form/Select/Select';
import { SocketContext } from '../../../shared/providers/SocketProvider';
import { useAuthStore } from '../../../shared/stores';
import { useGetCouriers } from '../../storage-facilities/hooks/useGetCouriers';
import { useEditProductItem } from '../hooks/useEditProductItem';
import { productItemFormValidationSchema } from './ProductItemForm';

interface ProductItemFormProps {
  onClose?: () => void;
  productItem: ProductItemDTO;
  isRfidOptional: boolean;
  isCourier?: boolean;
}

export const generateMockRfId = () => Math.random().toString(36).slice(-8);

export const EditProductItemForm: React.FC<ProductItemFormProps> = ({
  onClose,
  productItem,
  isRfidOptional,
  isCourier,
}) => {
  const { companyId, companyType } = useAuthStore();
  const { data } = useGetCouriers(companyId);
  const couriers = data?.data;
  const ediProductItem = useEditProductItem(productItem.id);
  const isReturnAccepted =
    productItem.status === ProductItemDTOStatusEnum.ReturnAccepted;
  const isInStorageFacility =
    productItem.status === ProductItemDTOStatusEnum.InStorageFacility;
  const isToBePickedUp =
    productItem.status === ProductItemDTOStatusEnum.ToBePickedUp;

  const onSubmit = (dto: CreateProductItemDTO) => {
    if (isCourier) {
      if (isReturnAccepted) {
        dto.status = CreateProductItemDTOStatusEnum.InTransitToSeller;
      } else if (isToBePickedUp) {
        dto.status = CreateProductItemDTOStatusEnum.InTransitToStorageFacility;
      } else if (isInStorageFacility) {
        dto.status = CreateProductItemDTOStatusEnum.InTransitToBuyer;
      }
    }

    ediProductItem.mutate(dto, {
      onSettled: () => {
        if (onClose) {
          onClose();
        }
      },
    });
  };

  const socket = useContext(SocketContext);
  const formikRef = useRef<any>(null);

  useEffect(() => {
    if (socket) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.on('test', (dto: ProductItemLocationDTO) => {
        if (formikRef.current) {
          formikRef.current.setFieldValue('rfid', dto.rfid);
        }
      });
    }

    return () => {
      socket?.close();
    };
  }, [socket]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        rfid: productItem.rfid,
        status: productItem.status as unknown as CreateProductItemDTOStatusEnum,
        courierId: productItem.courier?.id,
      }}
      validationSchema={() => productItemFormValidationSchema(isRfidOptional)}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            {(!isRfidOptional || isCourier) && (
              <Field name='rfid' type='text'>
                {(fieldProps: FieldProps<string, CreateProductItemDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='rfid'
                    label='EPC (Electronic Product Code)'
                    type='text'
                    id='rfid'
                    borderColor='gray.300'
                    bgColor='gray.50'
                    color='gray.800'
                    disabled
                  />
                )}
              </Field>
            )}
            {!isCourier && (
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
                    <option
                      value={
                        CreateProductItemDTOStatusEnum.InTransitToStorageFacility
                      }
                    >
                      IN TRANSIT TO STORAGE FACILITY
                    </option>
                    <option
                      value={CreateProductItemDTOStatusEnum.InStorageFacility}
                    >
                      IN STORAGE FACILITY
                    </option>
                    <option
                      value={CreateProductItemDTOStatusEnum.InTransitToBuyer}
                    >
                      IN TRANSIT TO BUYER
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
                    <option value={CreateProductItemDTOStatusEnum.Returned}>
                      RETURNED
                    </option>
                    <option
                      value={CreateProductItemDTOStatusEnum.ReturnRequested}
                    >
                      RETURN REQUESTED
                    </option>
                    <option
                      value={CreateProductItemDTOStatusEnum.ReturnAccepted}
                    >
                      RETURN ACCEPTED
                    </option>
                    <option
                      value={CreateProductItemDTOStatusEnum.ReturnRejected}
                    >
                      RETURN REJECTED
                    </option>
                    <option
                      value={CreateProductItemDTOStatusEnum.InTransitToSeller}
                    >
                      IN TRANSIT TO SELLER
                    </option>
                  </Select>
                )}
              </Field>
            )}

            {!!couriers &&
              companyType === CompanyDTOTypeEnum.StorageFacility && (
                <Field name='courierId' type='text'>
                  {(fieldProps: FieldProps<string, CreateProductItemDTO>) => (
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
