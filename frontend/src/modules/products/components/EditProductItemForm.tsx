import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  CreateProductItemDTO,
  CreateProductItemDTOStatusEnum,
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  ScanRfidDTO,
} from 'generated-api';
import { useContext, useRef, useEffect } from 'react';
import { Input } from '../../../shared/components/form/Input/Input';
import { Select } from '../../../shared/components/form/Select/Select';
import { SocketContext } from '../../../shared/providers/SocketProvider';
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
  const ediProductItem = useEditProductItem(productItem.id);
  const isReturning = productItem.status === ProductItemDTOStatusEnum.Returning;

  const onSubmit = (dto: CreateProductItemDTO) => {
    if (isCourier) {
      if (isReturning) {
        dto.status = CreateProductItemDTOStatusEnum.Returned;
      } else {
        dto.status = CreateProductItemDTOStatusEnum.InTransit;
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

      socket.on('scan', (dto: ScanRfidDTO) => {
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
                    <option value={CreateProductItemDTOStatusEnum.Returned}>
                      RETURNED
                    </option>
                    <option value={CreateProductItemDTOStatusEnum.Returning}>
                      RETURNING
                    </option>
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
