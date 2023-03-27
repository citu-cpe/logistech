import {
  Box,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useGetOrder } from '../../modules/orders/hooks/useGetOrder';
import { Peso } from '../../shared/components/Peso';
import { addLeadingZeros } from '../../shared/utils/addLeadingZeros';

const Invoice = () => {
  const router = useRouter();
  const { id: orderId } = router.query;
  const { data } = useGetOrder(orderId as string);
  const order = data?.data;

  return (
    !!order && (
      <Box>
        <Heading mb='8'>
          Invoice #{addLeadingZeros(order.invoiceNumber, 4)}
        </Heading>

        <Box mb='8'>
          <Text fontWeight='bold'>{order.toCompany?.name}</Text>
          <Text>{order.toCompany?.address}</Text>
          <Text>{order.toCompany?.contactNumber}</Text>
          <Text>{order.toCompany?.email}</Text>
        </Box>

        <Box mb='8'>
          <Flex justify='space-between'>
            <Box>
              <Text fontWeight='semibold'>
                Due Payable:{' '}
                <Peso amount={order.total + (order.shippingFee ?? 0)} />
              </Text>
              <Text fontWeight='semibold'>
                Due Date:{' '}
                {order.dueDate
                  ? new Date(order.dueDate).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </Box>

            <Box minW='xs'>
              <Text fontWeight='semibold'>Bill to</Text>
              <Text fontWeight='bold'>{order.fromCompany?.name}</Text>
              <Text>{order.fromCompany?.address}</Text>
              <Text>{order.fromCompany?.contactNumber}</Text>
              <Text>{order.fromCompany?.email}</Text>
            </Box>
          </Flex>
        </Box>

        <Box>
          <Box>
            <TableContainer>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>
                      <Heading size='md'>Description</Heading>
                    </Td>
                    <Td></Td>
                    <Td></Td>
                    <Td isNumeric></Td>
                  </Tr>

                  {order.orderItems.map((item) => (
                    <Tr key={item.id}>
                      <Td></Td>
                      <Td>{item.product.name}</Td>
                      <Td>
                        {item.quantity} box{item.quantity > 1 && 'es'}
                      </Td>
                      <Td isNumeric>
                        <Peso amount={item.product.price * item.quantity} />
                      </Td>
                    </Tr>
                  ))}

                  <Tr>
                    <Td></Td>
                    <Td></Td>
                    <Td>
                      <Text fontWeight='semibold'>3PL Billing</Text>
                    </Td>
                    <Td isNumeric>
                      <Text fontWeight='semibold'>
                        <Peso amount={order.shippingFee ?? 0} />
                      </Text>
                    </Td>
                  </Tr>

                  <Tr>
                    <Td></Td>
                    <Td></Td>
                    <Td>
                      <Text fontWeight='extrabold'>Total Amount</Text>
                    </Td>
                    <Td isNumeric>
                      <Text fontWeight='extrabold'>
                        <Peso amount={order.total + (order.shippingFee ?? 0)} />
                      </Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    )
  );
};

export default Invoice;
