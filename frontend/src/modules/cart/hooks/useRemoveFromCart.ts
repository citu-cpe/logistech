import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { CART_QUERY_KEY } from './useGetCart';

export const useRemoveFromCart = () => {
  const api = useContext(ApiContext);
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (orderItemId: string) => api.deleteOrderItem(orderItemId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CART_QUERY_KEY);
        toast({
          status: 'success',
          title: 'Removed from cart',
          isClosable: true,
          variant: 'subtle',
        });
      },
    }
  );
};
