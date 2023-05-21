import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const PRODUCT_ITEMS_BY_COMPANY_QUERY_KEY = ['product-items', 'company'];

export const useGetProductItemsByCompany = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: PRODUCT_ITEMS_BY_COMPANY_QUERY_KEY,
    queryFn: () => api.getProductItemsByCompany(companyId!),
    enabled: !!companyId,
  });
};
