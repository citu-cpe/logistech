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
import { ProductItemDTO } from 'generated-api';
import { ReportForm } from '../../reports/components/ReportForm';

interface RedFlagRowProps {
  productItem: ProductItemDTO;
}

export const RedFlagRow: React.FC<RedFlagRowProps> = ({ productItem }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tr>
      <Td>{productItem.product?.name}</Td>
      <Td>{productItem.rfid}</Td>
      <Td>
        <Button onClick={onOpen}>
          <EditIcon />
        </Button>
      </Td>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReportForm productItemId={productItem.id} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
