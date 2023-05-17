import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartDTO } from 'generated-api';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { CUSTOMER_CART_QUERY_KEY } from '../../cart/hooks/useGetCartCustomer';
import { OUTGOING_ORDERS_QUERY_KEY } from './useGetOutgoingOrders';

export const useCreateOrdersCustomer = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  return useMutation((dto: CartDTO) => api.createOrdersForCustomer(dto), {
    onSuccess: () => {
      queryClient.invalidateQueries(CUSTOMER_CART_QUERY_KEY);
      queryClient.invalidateQueries(OUTGOING_ORDERS_QUERY_KEY);
      toast({
        status: 'success',
        title: 'Successfully placed order',
        isClosable: true,
        variant: 'subtle',
      });
      router.push('/orders');
    },
  });
};
