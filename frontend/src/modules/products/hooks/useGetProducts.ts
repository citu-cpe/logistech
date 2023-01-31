import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const PRODUCTS_QUERY_KEY = ['products'];

export const useGetProducts = (companyId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => api.getProductsForCompany(companyId),
    enabled: !!companyId,
  });
};
