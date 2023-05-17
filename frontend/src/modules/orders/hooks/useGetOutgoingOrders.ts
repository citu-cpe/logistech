import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const OUTGOING_ORDERS_QUERY_KEY = ['orders', 'outgoing'];

export const useGetOutgoingOrders = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: OUTGOING_ORDERS_QUERY_KEY,
    queryFn: () => api.getOutgoingOrders(companyId!),
    enabled: !!companyId,
  });
};
