import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  useDisclosure,
  Tr,
  Td,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { ProductItemDTO } from 'generated-api';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { useDeleteProductItem } from '../hooks/useDeleteProductItem';
import { EditProductItemForm } from './EditProductItemForm';

interface ProductItemRowProps {
  productItem: ProductItemDTO;
  productId: string;
}

export const ProductItemRow: React.FC<ProductItemRowProps> = ({
  productItem,
  productId,
}) => {
  const {
    isOpen: isEditProductItemOpen,
    onOpen: onEditProductItemOpen,
    onClose: onEditProductItemClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteProductItemOpen,
    onOpen: onDeleteProductItemOpen,
    onClose: onDeleteProductItemClose,
  } = useDisclosure();
  const deleteProductItemMutation = useDeleteProductItem(productId);

  const deleteProductItem = () => {
    deleteProductItemMutation.mutate(productItem.id);
  };

  return (
    <Tr key={productItem.id}>
      <Td>{productItem.rfid}</Td>
      <Td>
        <StatusBadge status={productItem.status} />
      </Td>

      <Td>
        <HStack spacing='4'>
          <Button onClick={onEditProductItemOpen}>
            <EditIcon />
          </Button>
          <Button onClick={onDeleteProductItemOpen}>
            <DeleteIcon />
          </Button>
        </HStack>
      </Td>

      <Modal isOpen={isEditProductItemOpen} onClose={onEditProductItemClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditProductItemForm
              productItem={productItem}
              productId={productId as string}
              onClose={onEditProductItemClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteProductItemOpen}
        onClose={onDeleteProductItemClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this product item? This action
            cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant='ghost' onClick={onDeleteProductItemClose}>
              Close
            </Button>
            <Button
              colorScheme='red'
              isLoading={deleteProductItemMutation.isLoading}
              onClick={deleteProductItem}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
