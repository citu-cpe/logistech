import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Tr,
  Td,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Button,
  HStack,
  ModalFooter,
} from '@chakra-ui/react';
import { ProductDTO } from 'generated-api';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { EditProductForm } from './EditProductForm';
import Link from 'next/link';
import { Peso } from '../../../shared/components/Peso';

interface ProductRowProps {
  product: ProductDTO;
}

export const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  const {
    isOpen: isEditProductOpen,
    onOpen: onEditProductOpen,
    onClose: onEditProductClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteProductOpen,
    onOpen: onDeleteProductOpen,
    onClose: onDeleteProductClose,
  } = useDisclosure();
  const deleteProductMutation = useDeleteProduct();

  const deleteProduct = () => {
    deleteProductMutation.mutate(product.id);
  };

  return (
    <Tr key={product.id}>
      <Td>
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </Td>
      <Td isNumeric>
        <Peso amount={product.price} />
      </Td>
      <Td>
        <Checkbox defaultChecked={product.bulk} disabled />
      </Td>
      <Td isNumeric>{product.bulkQuantity ?? 'n/a'}</Td>
      <Td>
        <HStack spacing='4'>
          <Button onClick={onEditProductOpen}>
            <EditIcon />
          </Button>
          <Button onClick={onDeleteProductOpen}>
            <DeleteIcon />
          </Button>
        </HStack>
      </Td>

      <Modal isOpen={isEditProductOpen} onClose={onEditProductClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditProductForm product={product} onClose={onEditProductClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteProductOpen} onClose={onDeleteProductClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this product? This will also delete
            all product items. This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant='ghost' onClick={onDeleteProductClose}>
              Close
            </Button>
            <Button
              colorScheme='red'
              isLoading={deleteProductMutation.isLoading}
              onClick={deleteProduct}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Tr>
  );
};
