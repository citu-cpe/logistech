import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateOrderDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { INCOMING_ORDERS_QUERY_KEY } from './useGetIncomingOrders';
import { STORAGE_FACILITY_ORDERS_QUERY_KEY } from './useGetOrdersForStorageFacility';

export const useUpdateOrder = (orderId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation((dto: UpdateOrderDTO) => api.updateOrder(orderId, dto), {
    onSuccess: () => {
      queryClient.invalidateQueries(INCOMING_ORDERS_QUERY_KEY);
      queryClient.invalidateQueries(STORAGE_FACILITY_ORDERS_QUERY_KEY);
    },
  });
};
