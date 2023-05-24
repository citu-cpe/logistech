import {
  Box,
  Center,
  Flex,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import {
  CompanyDTOTypeEnum,
  OrderDTOStatusEnum,
  UserDTORoleEnum,
} from 'generated-api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { OrdersTable } from '../../modules/orders/components/OrdersTable';
import { useGetIncomingOrders } from '../../modules/orders/hooks/useGetIncomingOrders';
import { useGetOrdersForStorageFacility } from '../../modules/orders/hooks/useGetOrdersForStorageFacility';
import { useGetOutgoingOrders } from '../../modules/orders/hooks/useGetOutgoingOrders';
import { useGetOutgoingOrdersForCustomer } from '../../modules/orders/hooks/useGetOutgoingOrdersForCustomer';
import { useAuthStore } from '../../shared/stores';

const Orders = () => {
  const { user, companyId, companyType } = useAuthStore();
  const incomingOrdersQuery = useGetIncomingOrders(companyId);
  const outgoingOrdersQuery = useGetOutgoingOrders(companyId);
  const storageFacilityOrdersQuery = useGetOrdersForStorageFacility(companyId);
  const customerOrdersQuery = useGetOutgoingOrdersForCustomer();
  const toast = useToast();
  const router = useRouter();

  const isCustomer = user?.role === UserDTORoleEnum.Customer;

  useEffect(() => {
    if (router.query.success) {
      toast({
        status: 'success',
        title: 'Successfully paid order',
        isClosable: true,
        variant: 'subtle',
      });
    } else if (router.query.canceled) {
      toast({
        status: 'success',
        title: 'Successfully canceled payment',
        isClosable: true,
        variant: 'subtle',
      });
    }
  }, [router.query, toast]);

  const actualIsLoading = isCustomer
    ? customerOrdersQuery.isLoading
    : incomingOrdersQuery.isLoading || outgoingOrdersQuery.isLoading;

  return (
    <Box>
      <Heading mb='6'>Orders</Heading>

      {companyType !== CompanyDTOTypeEnum.StorageFacility && (
        <>
          {actualIsLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Tabs isFitted>
              <TabList mb='1em'>
                {companyType !== CompanyDTOTypeEnum.Supplier && (
                  <Tab>Outgoing</Tab>
                )}
                {!isCustomer && <Tab>Incoming</Tab>}
              </TabList>
              <TabPanels>
                {companyType !== CompanyDTOTypeEnum.Supplier && (
                  <TabPanel>
                    <OrdersTable
                      orders={
                        outgoingOrdersQuery?.data?.data ??
                        customerOrdersQuery.data?.data ??
                        []
                      }
                      allowEdit={false}
                      incoming={false}
                      allowPayment={true}
                      showTotal={true}
                    />
                  </TabPanel>
                )}
                <TabPanel>
                  <OrdersTable
                    orders={incomingOrdersQuery?.data?.data ?? []}
                    allowEdit={true}
                    incoming={true}
                    allowPayment={false}
                    showTotal={true}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </>
      )}

      {companyType === CompanyDTOTypeEnum.StorageFacility && (
        <Flex gap='4'>
          <Box width='50%'>
            <Heading textAlign='center' mb='4'>
              Incoming
            </Heading>

            {storageFacilityOrdersQuery.isLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Box bg='gray.900' rounded='md' padding='8'>
                <OrdersTable
                  orders={
                    storageFacilityOrdersQuery?.data?.data.filter(
                      (o) => o.status === OrderDTOStatusEnum.Pending
                    ) ?? []
                  }
                  allowEdit={true}
                  incoming={false}
                  allowPayment={false}
                  showTotal={false}
                  billed={false}
                />
              </Box>
            )}
          </Box>

          <Box width='50%'>
            <Heading textAlign='center' mb='4'>
              To Be Picked Up
            </Heading>

            {storageFacilityOrdersQuery.isLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Box bg='gray.900' rounded='md' padding='8'>
                <OrdersTable
                  orders={
                    storageFacilityOrdersQuery?.data?.data.filter(
                      (o) => o.status === OrderDTOStatusEnum.Billed
                    ) ?? []
                  }
                  allowEdit={true}
                  incoming={false}
                  allowPayment={false}
                  showTotal={false}
                  billed={true}
                />
              </Box>
            )}
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default Orders;
