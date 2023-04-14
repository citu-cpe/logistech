import { useQuery } from "@tanstack/react-query";
import { ProductItemByStatusDTOStatusEnum } from "generated-api";
import { useContext } from "react";
import { ApiContext } from "../providers/ApiProvider";

export const PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY = (
  status: ProductItemByStatusDTOStatusEnum
) => ["product-items", status];

export const useGetProductsByStatusAndUser = (
  status: ProductItemByStatusDTOStatusEnum
) => {
  const api = useContext(ApiContext);

  return useQuery({
    queryFn: () => api.getProductItemsByStatusAndUser({ status }),
    queryKey: ["product-items", status],
  });
};
