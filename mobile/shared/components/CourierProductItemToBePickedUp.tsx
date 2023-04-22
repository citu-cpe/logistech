import {
  ProductItemDTO,
  UpdateProductItemStatusDTOStatusEnum,
} from "generated-api";
import { Flex, Button, Text, Box } from "native-base";
import { useUpdateProductItemStatus } from "../hooks/useUpdateProductItemStatus";

interface CourierProductItemProps {
  productItem: ProductItemDTO;
}

export const CourierProductItemToBePickedUp: React.FC<
  CourierProductItemProps
> = ({ productItem }) => {
  const updateProductItemStatus = useUpdateProductItemStatus(productItem.id);

  return (
    <Flex
      key={productItem.id}
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <Text color="white">{productItem.rfid}</Text>
        <Text color="gray.400">{productItem.customer?.address}</Text>
      </Box>

      <Button
        isLoading={updateProductItemStatus.isLoading}
        onPress={() =>
          updateProductItemStatus.mutate({
            status: UpdateProductItemStatusDTOStatusEnum.InTransit,
          })
        }
      >
        Accept
      </Button>
    </Flex>
  );
};
