import {
  useDisclosure,
  Flex,
  Heading,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ProductItemForm } from '../../modules/products/components/ProductItemForm';
import { ProductItemRow } from '../../modules/products/components/ProductItemRow';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { useGetProductItems } from '../../modules/products/hooks/useGetProductItems';

// TODO: create many
const ProductItem = () => {
  const router = useRouter();
  const { id: productId } = router.query;
  const { data } = useGetProductItems(productId as string);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex align='center' justify='space-between' mb='6'>
        <Heading>Product Items</Heading>

        <Button onClick={onOpen}>Create</Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Product Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductItemForm
              productId={productId as string}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {data?.data && (
        <ProductItemTable productItems={data?.data} allowActions />
      )}
    </Box>
  );
};

export default ProductItem;
