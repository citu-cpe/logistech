import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateProductItemDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCT_ITEMS_QUERY_KEY } from './useGetProductItems';

export const useCreateProductItem = (productId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation(
    (dto: CreateProductItemDTO) => api.createProductItem(productId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PRODUCT_ITEMS_QUERY_KEY);
      },
    }
  );
};
