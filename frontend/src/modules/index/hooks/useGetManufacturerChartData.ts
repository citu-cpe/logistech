import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const MANUFACTURER_CHART_DATA_QUERY_KEY = ['manufacturer-chart-data'];

export const useGetManufacturerChartData = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: MANUFACTURER_CHART_DATA_QUERY_KEY,
    queryFn: () => api.getManufacturerChartData(companyId!),
    enabled: !!companyId,
  });
};
