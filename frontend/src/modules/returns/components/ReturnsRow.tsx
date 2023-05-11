import { EditIcon } from '@chakra-ui/icons';
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
} from '@chakra-ui/react';
import { ProductItemDTO, UserDTO } from 'generated-api';
import { ProductItemStatusBadge } from '../../../shared/components/ProductItemStatusBadge';
import { AssignCourierToProductItemForm } from './AssignCourierToProductItemForm';

export interface ReturnsRowProps {
  productItem: ProductItemDTO;
  couriers: UserDTO[];
}

export const ReturnsRow: React.FC<ReturnsRowProps> = ({
  productItem,
  couriers,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tr>
      <Td>{productItem.rfid}</Td>
      <Td>
        <ProductItemStatusBadge status={productItem.status} />
      </Td>
      <Td>{productItem.customer?.username}</Td>
      <Td>{productItem.courier?.username}</Td>

      <Td>
        <Button onClick={onOpen}>
          <EditIcon />
        </Button>
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
