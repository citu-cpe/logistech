import { ProductItemDTO } from "generated-api";
import { Flex, Button, Text, Box } from "native-base";
import { useReturnProductItem } from "../hooks/useReturnProductItem";

interface CustomerProductItemCompleteProps {
  productItem: ProductItemDTO;
}

export const CustomerProductItemComplete: React.FC<
  CustomerProductItemCompleteProps
> = ({ productItem }) => {
  const returnProductItem = useReturnProductItem();

  return (
    <Flex
      key={productItem.id}
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      p="2"
    >
      <Box>
        <Text color="white" fontWeight="bold" fontSize="lg">
          {productItem.product?.name}
        </Text>
        <Text color="white">RFID: {productItem.rfid}</Text>
      </Box>
      <Button
        isLoading={returnProductItem.isLoading}
        onPress={() => returnProductItem.mutate(productItem.id)}
      >
        Return
      </Button>
    </Flex>
  );
};
