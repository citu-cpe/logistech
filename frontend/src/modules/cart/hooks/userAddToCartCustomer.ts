import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateOrderItemDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { COMMERCE_PRODUCTS_QUERY_KEY } from '../../commerce/hooks/useGetCommerceProducts';
import { CUSTOMER_CART_QUERY_KEY } from './useGetCartCustomer';

export const useAddToCartCustomer = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation(
    (dto: CreateOrderItemDTO) => api.addItemToCartCustomer(dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CUSTOMER_CART_QUERY_KEY);
        queryClient.invalidateQueries(COMMERCE_PRODUCTS_QUERY_KEY);
        toast({
          status: 'success',
          title: 'Added to cart',
          isClosable: true,
          variant: 'subtle',
        });
      },
    }
  );
};
