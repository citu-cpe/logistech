import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateProductDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCTS_QUERY_KEY } from './useGetProducts';

export const useCreateProduct = (companyId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation(
    (dto: CreateProductDTO) => api.createProduct(companyId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PRODUCTS_QUERY_KEY);
      },
    }
  );
};
