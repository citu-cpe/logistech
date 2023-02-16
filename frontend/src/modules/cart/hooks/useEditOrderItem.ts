import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateOrderItemDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { CART_QUERY_KEY } from './useGetCart';

export const useEditOrderItem = (id: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation((dto: CreateOrderItemDTO) => api.editOrderItem(id, dto), {
    onSuccess: () => {
      queryClient.invalidateQueries(CART_QUERY_KEY);
    },
  });
};
