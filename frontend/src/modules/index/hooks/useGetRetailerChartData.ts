import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const RETAILER_CHART_DATA_QUERY_KEY = ['retailer-chart-data'];

export const useGetRetailerChartData = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: RETAILER_CHART_DATA_QUERY_KEY,
    queryFn: () => api.getRetailerChartData(companyId!),
    enabled: !!companyId,
  });
};
