import { ProductDTO } from "generated-api";
import { Box, Button, Divider, Text } from "native-base";
import { useAddToCartCustomer } from "../hooks/useAddToCartCustomer";
import { CompanyTypeBadge } from "./CompanyTypeBadge";
import { Peso } from "./Peso";

interface CommerceItemProps {
  product: ProductDTO;
}

export const CommerceItem: React.FC<CommerceItemProps> = ({ product }) => {
  const addItemToCart = useAddToCartCustomer();
  const addToCart = (dto: ProductDTO) => {
    addItemToCart.mutate({ productId: dto.id, quantity: 1 });
  };
  const isOutOfStock = product.numInStock === 0;

  return (
    <>
      <Box
        key={product.id}
        w="full"
        color="white"
        display="flex"
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        p="3"
      >
        <Box>
          <Text color="white" fontWeight="bold">
            {product.name}
          </Text>
          <Text color="white">{product.company?.name}</Text>
          {product.bulk && <Text color="white">{product.bulkQuantity}</Text>}
          <CompanyTypeBadge companyType={product.company?.type!} />
          {isOutOfStock && <Text color="error.700">Out of stock</Text>}
        </Box>

        <Box display="flex" alignItems="flex-end">
          <Text mb="2">
            <Peso amount={product.price} color="white" fontWeight="bold" />{" "}
            {product.bulk && "per box"}
          </Text>
          <Button
            onPress={() => addToCart(product)}
            color="white"
            isLoading={addItemToCart.isLoading}
            disabled={isOutOfStock}
          >
            Add to cart
          </Button>
        </Box>
      </Box>
      <Divider />
    </>
  );
};
