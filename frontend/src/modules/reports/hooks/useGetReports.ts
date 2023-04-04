import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const REPORTS_QUERY_KEY = ['reports'];

export const useGetReports = (companyId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () => api.getReports(companyId),
    enabled: !!companyId,
  });
};
