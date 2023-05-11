import {
  ProductItemDTO,
  ProductItemDTOStatusEnum,
  UpdateProductItemStatusDTOStatusEnum,
} from "generated-api";
import { Button, Flex, Box, Divider, Text } from "native-base";
import React from "react";
import { useUpdateProductItemStatus } from "../hooks/useUpdateProductItemStatus";
import { ProductItemStatusBadge } from "./ProductItemStatusBadge";

interface ProductItemItemProps {
  productItem: ProductItemDTO;
}

export const ProductItemItem: React.FC<ProductItemItemProps> = ({
  productItem,
}) => {
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);

  return (
    <React.Fragment key={productItem.id}>
      <Flex
        w="full"
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box p="2">
          <Text color="white" fontWeight="bold" fontSize="lg">
            {productItem.product?.name}
          </Text>
          <Text color="white">RFID: {productItem.rfid}</Text>
        </Box>

        <Box>
          <Box>
            {productItem.status === ProductItemDTOStatusEnum.Complete && (
              <Button
                isLoading={updateProductItemStatus.isLoading}
                onPress={() =>
                  updateProductItemStatus.mutate({
                    status: UpdateProductItemStatusDTOStatusEnum.Returning,
                  })
                }
              >
                Return
              </Button>
            )}
            {(productItem.status === ProductItemDTOStatusEnum.Returning ||
              productItem.status === ProductItemDTOStatusEnum.Returned) && (
              <ProductItemStatusBadge status={productItem.status} />
            )}
          </Box>
        </Box>
      </Flex>
      <Divider />
    </React.Fragment>
  );
};
