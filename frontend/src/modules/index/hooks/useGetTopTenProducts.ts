import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const TOP_TEN_PRODUCTS_QUERY_KEY = ['top-ten-products'];

export const useGetTopTenProducts = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: TOP_TEN_PRODUCTS_QUERY_KEY,
    queryFn: () => api.getTopTenProducts(companyId!),
    enabled: !!companyId,
  });
};
