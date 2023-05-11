import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AssignCourierToProductItemDTO,
  ProductItemByStatusDTOStatusEnum,
} from 'generated-api';
import { useContext } from 'react';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { PRODUCT_ITEMS_BY_STATUS_QUERY_KEY } from '../../products/hooks/useGetProductItemsByStatus';

export const useAssignCourierToProductItem = (productItemId: string) => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  return useMutation(
    (dto: AssignCourierToProductItemDTO) =>
      api.assignCourierToProductItem(productItemId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          PRODUCT_ITEMS_BY_STATUS_QUERY_KEY(
            ProductItemByStatusDTOStatusEnum.Returning
          )
        );
      },
    }
  );
};
