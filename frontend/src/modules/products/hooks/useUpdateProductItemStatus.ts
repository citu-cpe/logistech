import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ProductItemByStatusDTOStatusEnum,
  UpdateProductItemStatusDTO,
} from 'generated-api';
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
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Complete
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.ToBePickedUp
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.InTransit
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Returning
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.OnHold
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.RedFlag
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Canceled
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Returned
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.InStorage
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Complete
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.ToBePickedUp
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.InTransit
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Returning
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.OnHold
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.RedFlag
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Canceled
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Returned
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.InStorage
          )
        );
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
