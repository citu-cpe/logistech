import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCT_ITEMS_QUERY_KEY } from './useGetProductItems';

export const useDeleteProductItem = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation((id: string) => api.deleteProductItem(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(PRODUCT_ITEMS_QUERY_KEY);
    },
  });
};
