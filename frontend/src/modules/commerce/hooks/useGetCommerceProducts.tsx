import { useQuery } from '@tanstack/react-query';
import { CommerceProductDTOCompanyTypesEnum } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const COMMERCE_PRODUCTS_QUERY_KEY = ['commerce-products'];

export const useGetCommerceProducts = (
  companyTypes: CommerceProductDTOCompanyTypesEnum[],
  companyId: string
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: COMMERCE_PRODUCTS_QUERY_KEY,
    queryFn: () => api.getCommerceProducts(companyId, { companyTypes }),
    enabled: !!companyTypes && !!companyId,
  });
};
