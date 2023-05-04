import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const STORAGE_FACILITY_PAID_ORDERS_QUERY_KEY = [
  'orders',
  'storage-facility',
  'paid',
];

export const useGetPaidOrdersForStorageFacility = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: STORAGE_FACILITY_PAID_ORDERS_QUERY_KEY,
    queryFn: () => api.getPaidOrdersForStorageFacility(companyId!),
    enabled: !!companyId,
  });
};
