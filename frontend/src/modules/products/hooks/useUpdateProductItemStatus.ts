import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateProductItemStatusDTO } from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCT_ITEMS_BY_STATUS_QUERY_KEY } from './useGetProductItemsByStatus';
import { PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY } from './useGetProductItemsByStatusAndUser';

export const useUpdateProductItemStatus = (productItemId: string) => {
  const api = useContext(ApiContext);
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (dto: UpdateProductItemStatusDTO) =>
      api.updateProductItemStatus(productItemId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY
        );
        queryClient.invalidateQueries(PRODUCT_ITEMS_BY_STATUS_QUERY_KEY);
        toast({
          status: 'success',
          title: 'Updated product item',
          isClosable: true,
          variant: 'subtle',
        });
      },
    }
  );
};
