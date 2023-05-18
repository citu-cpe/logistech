import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const PRODUCT_ITEM_STATUS_QUANTITY_QUERY_KEY = [
  'product-item-status-quantity',
];

export const useGetProductItemStatusQuantity = (
  companyId?: string,
  courierId?: string
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: PRODUCT_ITEM_STATUS_QUANTITY_QUERY_KEY,
    queryFn: () => api.getProductItemStatusQuantity(companyId!, { courierId }),
    enabled: !!companyId,
  });
};
