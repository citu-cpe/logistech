import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const STORAGE_FACILITY_AVAILABLE_QUERY_KEY = [
  'storage-facility',
  'available',
];

export const useGetAvailableStorageFacilities = (companyId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: STORAGE_FACILITY_AVAILABLE_QUERY_KEY,
    queryFn: () => api.getAvailableStorageFacilities(companyId),
    enabled: !!companyId,
  });
};
