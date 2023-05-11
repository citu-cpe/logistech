import { useQueryClient } from "@tanstack/react-query";
import {
  ProductItemByStatusDTOStatusEnum,
  ProductItemDTO,
  UpdateProductItemStatusDTOStatusEnum,
} from "generated-api";
import { Flex, Button, Text, Box, useToast } from "native-base";
import { useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { COURIER_PRODUCT_ITEMS } from "../hooks/useGetCourierAssignedProductItems";
import { PRODUCT_ITEMS_BY_STATUS_AND_USER_QUERY_KEY } from "../hooks/useGetProductsByStatusAndUser";
import { useUpdateProductItemStatus } from "../hooks/useUpdateProductItemStatus";

interface CourierProductItemProps {
  productItem: ProductItemDTO;
}

export const CourierProductItemToBePickedUp: React.FC<
  CourierProductItemProps
> = ({ productItem }) => {
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  return (
    <Flex
      key={productItem.id}
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      mb="2"
    >
      <Box>
        <Text color="white">{productItem.rfid}</Text>
        <Text color="gray.400">{productItem.customer?.address}</Text>
      </Box>

      <Button
        isLoading={updateProductItemStatus.isLoading || isLoading}
        onPress={async () => {
          setIsLoading(true);
          await axios.patch(`/product/product-item/${productItem.id}/status`, {
            status: UpdateProductItemStatusDTOStatusEnum.InTransit,
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
        Accept
      </Button>
    </Flex>
  );
};
