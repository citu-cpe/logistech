import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { OrdersTable } from '../../modules/orders/components/OrdersTable';
import { useGetIncomingOrders } from '../../modules/orders/hooks/useGetIncomingOrders';
import { useGetOutgoingOrders } from '../../modules/orders/hooks/useGetOutgoingOrders';
import { useGlobalStore } from '../../shared/stores';

const Orders = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;
  const incomingOrdersQuery = useGetIncomingOrders(companyId!);
  const outgoingOrdersQuery = useGetOutgoingOrders(companyId!);

  return (
    <Box>
      <Heading>Orders</Heading>
      <Tabs isFitted>
        <TabList mb='1em'>
          <Tab>Outgoing</Tab>
          <Tab>Incoming</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OrdersTable
              orders={outgoingOrdersQuery?.data?.data ?? []}
              incoming={false}
            />
          </TabPanel>
          <TabPanel>
            <OrdersTable
              orders={incomingOrdersQuery?.data?.data ?? []}
              incoming={true}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Orders;
