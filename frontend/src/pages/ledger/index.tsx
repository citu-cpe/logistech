import { Center, Spinner } from '@chakra-ui/react';
import { LedgerTable } from '../../modules/ledger/components/LedgerTable';
import { useGetIncomingOrders } from '../../modules/orders/hooks/useGetIncomingOrders';
import { useGlobalStore } from '../../shared/stores';

const Ledger = () => {
  const getUser = useGlobalStore().getUser;
  const companyId = getUser()?.company?.id;
  const incomingOrdersQuery = useGetIncomingOrders(companyId!);

  return incomingOrdersQuery.isLoading ? (
    <Center>
      <Spinner></Spinner>
    </Center>
  ) : (
    <LedgerTable orders={incomingOrdersQuery.data?.data ?? []} />
  );
};

export default Ledger;
