import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCTS_QUERY_KEY } from './useGetProducts';

export const useDeleteProduct = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation((id: string) => api.deleteProduct(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(PRODUCTS_QUERY_KEY);
    },
  });
};
