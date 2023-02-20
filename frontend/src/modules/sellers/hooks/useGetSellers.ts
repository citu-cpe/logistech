import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const SELLERS_QUERY_KEY = ['sellers'];

export const useGetSellers = (companyId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: SELLERS_QUERY_KEY,
    queryFn: () => api.getSellerPartners(companyId),
    enabled: !!companyId,
  });
};
