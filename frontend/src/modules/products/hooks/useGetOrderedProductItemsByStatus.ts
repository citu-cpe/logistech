import { useQuery } from '@tanstack/react-query';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const ORDERED_PRODUCT_ITEMS_BY_STATUS_QUERY_KEY = [
  'product-items',
  'status',
  'ordered',
];

export const useGetOrderedProductItemsByStatus = (
  companyId?: string,
  status?: ProductItemByStatusDTOStatusEnum | ProductItemByStatusDTOStatusEnum[]
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: ORDERED_PRODUCT_ITEMS_BY_STATUS_QUERY_KEY,
    queryFn: () =>
      api.getOrderedProductItemsByStatus(companyId!, {
        status: Array.isArray(status!) ? status! : [status!],
      }),
    enabled: !!companyId && !!status,
  });
};
