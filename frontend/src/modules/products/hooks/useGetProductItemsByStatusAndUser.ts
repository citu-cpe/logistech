import { useQuery } from '@tanstack/react-query';
import { ProductItemByStatusDTOStatusEnum } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY = [
  'product-items',
  'status',
  'user',
];

export const useGetProductItemsByStatusAndUser = (
  status: ProductItemByStatusDTOStatusEnum | ProductItemByStatusDTOStatusEnum[],
  enabled?: boolean
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryFn: () =>
      api.getProductItemsByStatusAndUser({
        status: Array.isArray(status) ? status : [status],
      }),
    queryKey: PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY,
    enabled,
  });
};
