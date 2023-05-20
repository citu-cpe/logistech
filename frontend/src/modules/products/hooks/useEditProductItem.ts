import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateProductItemDTO,
  ProductItemByStatusDTOStatusEnum,
} from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCT_ITEMS_QUERY_KEY } from './useGetProductItems';
import { PRODUCT_ITEMS_BY_STATUS_QUERY_KEY } from './useGetProductItemsByStatus';

export const useEditProductItem = (id: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation(
    (dto: CreateProductItemDTO) => api.editProductItem(id, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(PRODUCT_ITEMS_QUERY_KEY);
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.InStorage
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
            ProductItemByStatusDTOStatusEnum.Complete
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.InTransit
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.ToBePickedUp
          )
        );
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Returning
          )
        );
      },
    }
  );
};
