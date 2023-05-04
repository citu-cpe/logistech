import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateOrderFromOrderItemsDTO } from 'generated-api';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { CART_QUERY_KEY } from '../../cart/hooks/useGetCart';
import { OUTGOING_ORDERS_QUERY_KEY } from '../../orders/hooks/useGetOutgoingOrders';

export const useCreateOrdersFromOrderItems = (companyId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  return useMutation(
    (dto: CreateOrderFromOrderItemsDTO) =>
      api.createOrdersFromOrderItems(companyId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CART_QUERY_KEY);
        queryClient.invalidateQueries(OUTGOING_ORDERS_QUERY_KEY);
        toast({
          status: 'success',
          title: 'Successfully placed order',
          isClosable: true,
          variant: 'subtle',
        });
        router.push('/orders');
      },
    }
  );
};
