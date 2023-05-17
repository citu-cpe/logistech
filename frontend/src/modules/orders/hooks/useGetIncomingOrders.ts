import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const INCOMING_ORDERS_QUERY_KEY = ['orders', 'incoming'];

export const useGetIncomingOrders = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: INCOMING_ORDERS_QUERY_KEY,
    queryFn: () => api.getIncomingOrders(companyId!),
    enabled: !!companyId,
  });
};
