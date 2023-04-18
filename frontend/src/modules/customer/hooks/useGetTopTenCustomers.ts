import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const TOP_TEN_CUSTOMERS_QUERY_KEY = ['top-ten-customers'];

export const useGetTopTenCustomers = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: TOP_TEN_CUSTOMERS_QUERY_KEY,
    queryFn: () => api.getTopTenCustomers(companyId!),
    enabled: !!companyId,
  });
};
