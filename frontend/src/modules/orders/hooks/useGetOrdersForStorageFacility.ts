import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const STORAGE_FACILITY_ORDERS_QUERY_KEY = ['orders', 'storage-facility'];

export const useGetOrdersForStorageFacility = (companyId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: STORAGE_FACILITY_ORDERS_QUERY_KEY,
    queryFn: () => api.getOrdersForStorageFacility(companyId),
    enabled: !!companyId,
  });
};
