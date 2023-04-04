import { useQuery } from '@tanstack/react-query';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const RED_FLAGS_QUERY_KEY = ['red-flags'];

export const useGetProductItemsByStatus = (
  companyId: string,
  status: ProductItemByStatusDTOStatusEnum
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: RED_FLAGS_QUERY_KEY,
    queryFn: () => api.getProductItemsByStatus(companyId, { status }),
    enabled: !!companyId,
  });
};
