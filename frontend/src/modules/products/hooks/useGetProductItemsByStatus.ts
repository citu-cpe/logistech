import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
} from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const PRODUCT_ITEMS_BY_STATUS_QUERY_KEY = ['product-items', 'status'];

export const useGetProductItemsByStatus = (
  companyId?: string,
  status?:
    | ProductItemByStatusDTOStatusEnum
    | ProductItemByStatusDTOStatusEnum[],
  onSuccess?: (data: AxiosResponse<ProductItemDTO[]>) => void
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: PRODUCT_ITEMS_BY_STATUS_QUERY_KEY,
    queryFn: () =>
      api.getProductItemsByStatus(companyId!, {
        status: Array.isArray(status!) ? status! : [status!],
      }),
    enabled: !!companyId && !!status,
    onSuccess,
  });
};
