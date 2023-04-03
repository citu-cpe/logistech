import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const SALES_QUERY_KEY = ['sales'];

export const useGetSales = (companyId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: SALES_QUERY_KEY,
    queryFn: () => api.getSales(companyId),
    enabled: !!companyId,
  });
};
