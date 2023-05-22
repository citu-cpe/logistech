import { useQuery } from '@tanstack/react-query';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const ORDERED_PRODUCT_ITEMS_BY_STATUS_QUERY_KEY = (
  status: ProductItemByStatusDTOStatusEnum
) => ['product-items', 'ordered', status];

export const useGetOrderedProductItemsByStatus = (
  companyId?: string,
  status?: ProductItemByStatusDTOStatusEnum
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: ORDERED_PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(status!),
    queryFn: () =>
      api.getOrderedProductItemsByStatus(companyId!, { status: status! }),
    enabled: !!companyId && !!status,
  });
};
