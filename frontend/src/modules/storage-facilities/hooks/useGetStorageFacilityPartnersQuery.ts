import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const STORAGE_FACILITY_PARTNERS_QUERY_KEY = [
  'storage-facility',
  'partners',
];

export const useGetStorageFacilityPartners = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: STORAGE_FACILITY_PARTNERS_QUERY_KEY,
    queryFn: () => api.getStorageFacilityPartners(companyId!),
    enabled: !!companyId,
  });
};
