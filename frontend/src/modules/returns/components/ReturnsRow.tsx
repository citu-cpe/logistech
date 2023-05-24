import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
  Tr,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  HStack,
} from '@chakra-ui/react';
import {
  ProductItemDTO,
  UpdateProductItemStatusDTOStatusEnum,
  UserDTO,
} from 'generated-api';
import { ProductItemStatusBadge } from '../../../shared/components/ProductItemStatusBadge';
import { useUpdateProductItemStatus } from '../../products/hooks/useUpdateProductItemStatus';
import { AssignCourierToProductItemForm } from './AssignCourierToProductItemForm';

export interface ReturnsRowProps {
  productItem: ProductItemDTO;
  couriers: UserDTO[];
  isStorageFacility: boolean;
}

export const ReturnsRow: React.FC<ReturnsRowProps> = ({
  productItem,
  couriers,
  isStorageFacility,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);

  return (
    <Tr>
      <Td>{productItem.rfid}</Td>
      <Td>
        <ProductItemStatusBadge status={productItem.status} />
      </Td>
      <Td>{productItem.customer?.username}</Td>
      <Td>{productItem.courier?.username}</Td>

      <Td>
        {isStorageFacility && (
          <Button onClick={onOpen}>
            <EditIcon />
          </Button>
        )}
        {!isStorageFacility && (
          <HStack>
            <Button
              isLoading={updateProductItemStatus.isLoading}
              onClick={() =>
                updateProductItemStatus.mutate({
                  status: UpdateProductItemStatusDTOStatusEnum.ReturnAccepted,
                })
              }
            >
              <CheckIcon />
            </Button>
            <Button
              isLoading={updateProductItemStatus.isLoading}
              onClick={() =>
                updateProductItemStatus.mutate({
                  status: UpdateProductItemStatusDTOStatusEnum.ReturnRejected,
                })
              }
            >
              <CloseIcon />
            </Button>
          </HStack>
        )}
      </Td>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Courier To Product Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AssignCourierToProductItemForm
              productItem={productItem}
              couriers={couriers}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
