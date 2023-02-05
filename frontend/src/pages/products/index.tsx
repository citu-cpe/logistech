import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { ProductForm } from '../../modules/products/components/ProductForm';
import { ProductRow } from '../../modules/products/components/ProductRow';
import { useGetProducts } from '../../modules/products/hooks/useGetProducts';
import { useGlobalStore } from '../../shared/stores';

const Products = () => {
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data } = useGetProducts(companyId!);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex align='center' justify='space-between' mb='6'>
        <Heading>Products</Heading>

        <Button onClick={onOpen}>Create</Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductForm companyId={companyId!} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Product name</Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>Bulk Quantity</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Products;
