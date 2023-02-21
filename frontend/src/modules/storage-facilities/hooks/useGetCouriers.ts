import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const COURIERS_QUERY_KEY = ['company', 'couriers'];

export const useGetCouriers = (companyId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: COURIERS_QUERY_KEY,
    queryFn: () => api.getCouriers(companyId),
    enabled: !!companyId,
  });
};
