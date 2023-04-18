import { useQuery } from '@tanstack/react-query';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const PRODUCT_ITEMS_BY_STATUS_QUERY_KEY = (
  status: ProductItemByStatusDTOStatusEnum
) => ['product-items', status];

export const useGetProductItemsByStatus = (
  companyId?: string,
  status?: ProductItemByStatusDTOStatusEnum
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(status!),
    queryFn: () => api.getProductItemsByStatus(companyId!, { status: status! }),
    enabled: !!companyId && !!status,
  });
};
