import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateReportDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { RED_FLAGS_QUERY_KEY } from '../../products/hooks/useGetProductItemsByStatus';

export const useCreateReport = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation((dto: CreateReportDTO) => api.createReport(dto), {
    onSuccess: () => {
      queryClient.invalidateQueries(RED_FLAGS_QUERY_KEY);
    },
  });
};
