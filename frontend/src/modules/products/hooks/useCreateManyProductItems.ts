import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateManyProductItemsDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCT_ITEMS_QUERY_KEY } from './useGetProductItems';

export const useCreateManyProductItems = (productId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation(
    (dto: CreateManyProductItemsDTO) =>
      api.createManyProductItems(productId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PRODUCT_ITEMS_QUERY_KEY);
      },
    }
  );
};
