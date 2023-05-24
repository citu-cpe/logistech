import { Box, Button, Center, Flex, Heading, Spinner } from '@chakra-ui/react';
import { UserDTORoleEnum } from 'generated-api';
import { OrderItemGroup } from '../../modules/cart/components/OrderItemGroup';
import { useGetCart } from '../../modules/cart/hooks/useGetCart';
import { useGetCartCustomer } from '../../modules/cart/hooks/useGetCartCustomer';
import { useCreateOrders } from '../../modules/orders/hooks/useCreateOrders';
import { useCreateOrdersCustomer } from '../../modules/orders/hooks/useCreateOrdersCustomer';
import { Peso } from '../../shared/components/Peso';
import { useAuthStore } from '../../shared/stores';

const Cart = () => {
  const { userRole, companyId } = useAuthStore();
  const { data, isLoading } = useGetCart(companyId);
  const { data: userCartData, isLoading: userCartDataIsLoading } =
    useGetCartCustomer();
  const createOrders = useCreateOrders(companyId!);
  const createOrdersCustomer = useCreateOrdersCustomer();

  const isCustomer = userRole === UserDTORoleEnum.Customer;
  const actualIsLoading = isCustomer ? userCartDataIsLoading : isLoading;
  const actualData = isCustomer ? userCartData?.data : data?.data;

  const onOrderAll = () => {
    if (isCustomer) {
      return createOrdersCustomer.mutate(actualData!);
    }

    createOrders.mutate(actualData!);
  };

  return actualIsLoading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <Box>
      {actualData && (
        <>
          <Heading mb='6'>Cart</Heading>

          <Box mb='6'>
            {actualData.groupedOrderItems.map((goi) => (
              <Box mb='8' key={goi.company.id}>
                <OrderItemGroup orderItemGroup={goi} />
              </Box>
            ))}
          </Box>

          <Flex justify='end' mb='8'>
            <Heading size='lg'>
              Grand Total: <Peso amount={actualData.total} />
            </Heading>
          </Flex>

          <Button
            onClick={onOrderAll}
            w='full'
            isLoading={createOrders.isLoading}
            isDisabled={actualData.groupedOrderItems.length === 0}
          >
            Order all
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;
