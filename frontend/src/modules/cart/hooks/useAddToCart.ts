import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateOrderItemDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { CART_QUERY_KEY } from './useGetCart';

export const useAddToCart = (companyId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation(
    (dto: CreateOrderItemDTO) => api.addItemToCart(companyId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CART_QUERY_KEY);
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
