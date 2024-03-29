import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateProductItemDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCT_ITEMS_QUERY_KEY } from './useGetProductItems';
import { PRODUCT_ITEMS_BY_COMPANY_QUERY_KEY } from './useGetProductItemsByCompany';
import { PRODUCT_ITEMS_BY_STATUS_QUERY_KEY } from './useGetProductItemsByStatus';

export const useEditProductItem = (id: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation(
    (dto: CreateProductItemDTO) => api.editProductItem(id, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PRODUCT_ITEMS_QUERY_KEY);
        queryClient.invalidateQueries(PRODUCT_ITEMS_BY_STATUS_QUERY_KEY);
        queryClient.invalidateQueries(PRODUCT_ITEMS_BY_COMPANY_QUERY_KEY);
      },
    }
  );
};
