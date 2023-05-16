import { useQueryClient } from "@tanstack/react-query";
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
  UpdateProductItemStatusDTOStatusEnum,
} from "generated-api";
import { ProductItemDTOStatusEnum } from "generated-api/dist/models/product-item-dto";
import { Flex, Button, Text, Box, useToast } from "native-base";
import { useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { COURIER_PRODUCT_ITEMS } from "../hooks/useGetCourierAssignedProductItems";
import { PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY } from "../hooks/useGetProductsByStatusAndUser";
import { useUpdateProductItemStatus } from "../hooks/useUpdateProductItemStatus";

interface CourierProductItemInTransit {
  productItem: ProductItemDTO;
}

export const CourierProductItemInTransit: React.FC<
  CourierProductItemInTransit
> = ({ productItem }) => {
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const axios = useAxios();

  const isReturning = productItem.status === ProductItemDTOStatusEnum.Returning;

  return (
    <Flex
      key={productItem.id}
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      mb="2"
    >
      <Box flexBasis="50%">
        <Text color="white">{productItem.rfid}</Text>

        {productItem.customer && (
          <Text color="gray.400">
            Customer address: {productItem.customer?.address}
          </Text>
        )}

        {productItem.buyer && (
          <Text color="gray.400">
            Buyer address: {productItem.buyer.address}
          </Text>
        )}

        {isReturning && productItem.product?.company && (
          <Text color="gray.400">
            Company address: {productItem.product?.company?.address}
          </Text>
        )}
      </Box>

      <Button
        isLoading={updateProductItemStatus.isLoading || isLoading}
        onPress={async () => {
          setIsLoading(true);
          await axios.patch(`/product/product-item/${productItem.id}/status`, {
            status: isReturning
              ? UpdateProductItemStatusDTOStatusEnum.Returned
              : UpdateProductItemStatusDTOStatusEnum.Complete,
          });
          setIsLoading(false);
          queryClient.invalidateQueries(COURIER_PRODUCT_ITEMS);
          queryClient.invalidateQueries(
            PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY(
              ProductItemByStatusDTOStatusEnum.Complete
            )
          );
          toast.show({
            title: "Updated product item",
            backgroundColor: "green.700",
            color: "green.50",
          });
        }}
      >
        {isReturning ? "Return" : "Complete"}
      </Button>
    </Flex>
  );
};
