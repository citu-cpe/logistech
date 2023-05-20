import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCT_ITEMS_QUERY_KEY } from './useGetProductItems';

export const useAssignRfidToProductItem = (productItemId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation(
    (rfid: string) => api.assignRfidToProductItem(productItemId, { rfid }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PRODUCT_ITEMS_QUERY_KEY);
      },
    }
  );
};
