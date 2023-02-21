import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { CompanyDTOTypeEnum } from 'generated-api';
import { OrdersTable } from '../../modules/orders/components/OrdersTable';
import { useGetIncomingOrders } from '../../modules/orders/hooks/useGetIncomingOrders';
import { useGetOrdersForStorageFacility } from '../../modules/orders/hooks/useGetOrdersForStorageFacility';
import { useGetOutgoingOrders } from '../../modules/orders/hooks/useGetOutgoingOrders';
import { useGlobalStore } from '../../shared/stores';

const Orders = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;
  const companyType = getUser()?.company?.type;
  const incomingOrdersQuery = useGetIncomingOrders(companyId!);
  const outgoingOrdersQuery = useGetOutgoingOrders(companyId!);
  const storageFacilityOrdersQuery = useGetOrdersForStorageFacility(companyId!);

  return (
    <Box>
      <Heading mb='6'>Orders</Heading>

      {companyType !== CompanyDTOTypeEnum.StorageFacility && (
        <Tabs isFitted>
          <TabList mb='1em'>
            <Tab>Outgoing</Tab>
            <Tab>Incoming</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <OrdersTable
                orders={outgoingOrdersQuery?.data?.data ?? []}
                allowActions={false}
                incoming={false}
              />
            </TabPanel>
            <TabPanel>
              <OrdersTable
                orders={incomingOrdersQuery?.data?.data ?? []}
                allowActions={true}
                incoming={true}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

      {companyType === CompanyDTOTypeEnum.StorageFacility && (
        <Box>
          <OrdersTable
            orders={storageFacilityOrdersQuery?.data?.data ?? []}
            allowActions={true}
            incoming={false}
          />
        </Box>
      )}
    </Box>
  );
};

export default Orders;
