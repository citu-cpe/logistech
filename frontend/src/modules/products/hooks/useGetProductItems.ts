import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const PRODUCT_ITEMS_QUERY_KEY = (productId?: string) => [
  productId,
  'product-item',
];

export const useGetProductItems = (productId: string) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: PRODUCT_ITEMS_QUERY_KEY(productId),
    queryFn: () => api.getProductItems(productId),
    enabled: !!productId,
  });
};
