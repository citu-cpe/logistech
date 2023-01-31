import { useQuery } from '@tanstack/react-query';
import { CompanyDTOTypeEnum } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const COMMERCE_PRODUCTS_QUERY_KEY = ['commerce-products'];

export const useGetCommerceProducts = (companyType: CompanyDTOTypeEnum) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryKey: COMMERCE_PRODUCTS_QUERY_KEY,
    queryFn: () => api.getCommerceProducts(companyType),
  });
};
