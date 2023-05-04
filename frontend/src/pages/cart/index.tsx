import { Box, Button, Center, Flex, Heading, Spinner } from '@chakra-ui/react';
import { OrderItemGroup } from '../../modules/cart/components/OrderItemGroup';
import { useGetCart } from '../../modules/cart/hooks/useGetCart';
import { useCreateOrders } from '../../modules/orders/hooks/useCreateOrders';
import { Peso } from '../../shared/components/Peso';
import { useGlobalStore } from '../../shared/stores';

const Cart = () => {
  const getUser = useGlobalStore((state) => state.getUser);
  const companyId = getUser()?.company?.id;
  const { data, isLoading } = useGetCart(companyId!);
  const createOrders = useCreateOrders(companyId!);

  return isLoading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <Box>
      {data?.data && (
        <>
          <Heading mb='6'>Cart</Heading>

          <Box mb='6'>
            {data.data.groupedOrderItems.map((goi) => (
              <Box mb='8' key={goi.company.id}>
                <OrderItemGroup orderItemGroup={goi} />
              </Box>
            ))}
          </Box>

          <Flex justify='end' mb='8'>
            <Heading size='lg'>
              Grand Total: <Peso amount={data.data.total} />
            </Heading>
          </Flex>

          <Button
            onClick={() => createOrders.mutate(data?.data!)}
            w='full'
            isLoading={createOrders.isLoading}
            isDisabled={data?.data.groupedOrderItems.length === 0}
          >
            Order all
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;
