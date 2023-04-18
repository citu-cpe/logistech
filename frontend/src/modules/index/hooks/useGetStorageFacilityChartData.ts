import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const STORAGE_FACILITY_CHART_DATA_QUERY_KEY = [
  'storage-facility-chart-data',
];

export const useGetStorageFacilityChartData = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: STORAGE_FACILITY_CHART_DATA_QUERY_KEY,
    queryFn: () => api.getStorageFacilityChartData(companyId!),
    enabled: !!companyId,
  });
};
