import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

const ORDER_QUERY_KEY = ['orders'];

export const useGetOrder = (orderId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: [...ORDER_QUERY_KEY, orderId],
    queryFn: () => api.getOrderById(orderId),
    enabled: !!orderId,
  });
};
