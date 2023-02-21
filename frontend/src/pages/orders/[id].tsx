import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useGetOrder } from '../../modules/orders/hooks/useGetOrder';
import { ProductItemTable } from '../../modules/products/components/ProductItemTable';
import { OrderStatusBadge } from '../../shared/components/OrderStatusBadge';
import { Peso } from '../../shared/components/Peso';

const Order = () => {
  const router = useRouter();
  const { id: orderId } = router.query;
  const { data } = useGetOrder(orderId as string);
  const order = data?.data;

  return (
    <Box>
      <Heading>Order Details</Heading>
      {order && (
        <>
          <Box my='8' fontWeight='semibold'>
            <Text>
              Status: <OrderStatusBadge status={order.status} />
            </Text>
            {order.toCompany && <Text>Company: {order.toCompany?.name}</Text>}
            <Text>
              Date ordered: {new Date(order.createdAt).toLocaleDateString()}
            </Text>
            <Text>
              Storage Facility: {order.storageFacility?.name ?? 'Unassigned'}
            </Text>
            <Text>Courier: {order.courier?.username ?? 'Unassigned'}</Text>
            <Text>
              Total: <Peso amount={order.total} />
            </Text>
          </Box>
          <Box>
            {data?.data.orderItems.map((o) => (
              <Box key={o.id} bg='gray.900' rounded='md' padding='8' mb='8'>
                <Flex justify='space-between' align='center' mb='8'>
                  <Heading size='lg'>{o.product.name}</Heading>
                  <Box fontWeight='semibold' textAlign='right'>
                    <Text>Quantity: {o.quantity}</Text>
                    <Text>
                      Total: <Peso amount={o.total} />
                    </Text>
                  </Box>
                </Flex>
                <Heading size='md' textAlign='center' mb='4'>
                  Product Items
                </Heading>
                <ProductItemTable productItems={o.productItems!} />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Order;
