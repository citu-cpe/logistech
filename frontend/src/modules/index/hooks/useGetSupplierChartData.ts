import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const SUPPLIER_CHART_DATA_QUERY_KEY = ['supplier-chart-data'];

export const useGetSupplierChartData = (companyId?: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: SUPPLIER_CHART_DATA_QUERY_KEY,
    queryFn: () => api.getSupplierChartData(companyId!),
    enabled: !!companyId,
  });
};
