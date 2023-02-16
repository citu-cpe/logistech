import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateOrderStatusDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { INCOMING_ORDERS_QUERY_KEY } from './useGetIncomingOrders';

export const useUpdateOrderStatus = (orderId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation(
    (dto: UpdateOrderStatusDTO) => api.updateOrderStatus(orderId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INCOMING_ORDERS_QUERY_KEY);
      },
    }
  );
};
