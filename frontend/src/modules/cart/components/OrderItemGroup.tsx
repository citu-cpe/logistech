import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { OrderItemGroup as OrderItemGroupType } from 'generated-api';
import { Peso } from '../../../shared/components/Peso';
import { useRemoveFromCart } from '../hooks/useRemoveFromCart';
import { OrderItemQuantityInput } from './OrderItemQuantityInput';

interface OrderItemGroupProps {
  orderItemGroup: OrderItemGroupType;
}

export const OrderItemGroup: React.FC<OrderItemGroupProps> = ({
  orderItemGroup,
}) => {
  const removeFromCart = useRemoveFromCart();

  return (
    <Box bg='gray.900' rounded='md' p='8'>
      <Flex justify='space-between' mb='4'>
        <Heading size='md'>{orderItemGroup.company.name}</Heading>
        <Heading size='md'>
          Total: <Peso amount={orderItemGroup.total} />
        </Heading>
      </Flex>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Product name</Th>
              <Th>Quantity</Th>
              <Th isNumeric>Total</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderItemGroup.orderItems.map((oi) => (
              <Tr key={oi.product.id}>
                <Td>{oi.product.name}</Td>
                <Td>
                  <OrderItemQuantityInput orderItem={oi} />
                </Td>
                <Td isNumeric>
                  <Peso amount={oi.total} />
                </Td>
                <Td isNumeric>
                  <Button
                    onClick={() => removeFromCart.mutate(oi.id)}
                    isLoading={removeFromCart.isLoading}
                  >
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
