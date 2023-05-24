import { Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  CreateProductItemDTO,
  CreateProductItemDTOStatusEnum,
  ScanRfidDTO,
} from 'generated-api';
import { useContext, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { Input } from '../../../shared/components/form/Input/Input';
import { Select } from '../../../shared/components/form/Select/Select';
import { SocketContext } from '../../../shared/providers/SocketProvider';
import { useCreateProductItem } from '../hooks/useCreateProductItem';

interface ProductItemFormProps {
  onClose?: () => void;
  productId: string;
  isRfidOptional: boolean;
}

export const productItemFormValidationSchema = (isRfidOptional?: boolean) => {
  return Yup.object({
    rfid: isRfidOptional
      ? Yup.string().min(1).nullable()
      : Yup.string().min(1).required('Required'),
    status: Yup.string().min(1).required('Required'),
  });
};
export const generateMockRfId = () => Math.random().toString(36).slice(-8);

export const ProductItemForm: React.FC<ProductItemFormProps> = ({
  onClose,
  productId,
  isRfidOptional,
}) => {
  const createProductItem = useCreateProductItem(productId);
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
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={() => productItemFormValidationSchema(isRfidOptional)}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            {!isRfidOptional && (
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
            {/* <Button */}
            {/*   mt='2' */}
            {/*   w='full' */}
            {/*   bgColor='gray.800' */}
            {/*   color='gray.50' */}
            {/*   _hover={{ bgColor: 'gray.800', color: 'gray.50' }} */}
            {/*   onClick={() => { */}
            {/*     if (formikRef.current) { */}
            {/*       formikRef.current.setFieldValue('rfid', 'test'); */}
            {/*     } */}
            {/*   }} */}
            {/* > */}
            {/*   Test */}
            {/* </Button> */}
          </Box>
        </Form>
      )}
    </Formik>
  );
};
